from dash import register_page, Dash, dash_table, html, callback, Output, Input
import pandas as pd
import sys
import dash_bootstrap_components as dbc
import dash_leaflet as dl

dictionary = {'localidad': 'Localidad', 'direccion': 'Dirección', 'cantidad': 'Cantidad'}

def map_plotting(poin = None):
    df = pd.read_csv('src/Dataset/pendientes.csv')
    df = df[df['recoleccion']==False]
    df['cantidad'] = df[['bicicleta', 'motocicleta', 'automovil13', 'automovil14', 'automovil15',
                         'camioneta16', 'camioneta17', 'camioneta18', 'camioneta19', 'especiales']].sum(axis=1)
    points = [{'title': str(k),
               'position': [df['latitud'].iloc[k], df['longitud'].iloc[k]]} for k in range(len(df))]
    markers = [dl.Marker(**city) for city in points]
    cluster = dl.MarkerClusterGroup(id='markers', children = markers)
    try:
        center = [sum([x['position'][0] for x in points])/len(points), sum([x['position'][1] for x in points])/len(points)]
    except:
        center = [4.6097100, -74.0817500]
    if not poin == None:
        poi = dl.Marker(**{'title': 'Point','position': [df['latitud'].iloc[poin], df['longitud'].iloc[poin]]})
    return ([dl.TileLayer(), cluster if poin == None else poi],
            center,
            df.to_dict('records'),
            df
            )

register_page(__name__,path='/pendiente')
'''
df = pd.read_csv('../../Dataset/pendientes.csv')
df['cantidad'] = df[['bicicleta','motocicleta','automovil13','automovil14','automovil15',
                            'camioneta16','camioneta17','camioneta18','camioneta19','especiales']].sum(axis=1)
dictionary = {'localidad': 'Localidad', 'direccion':'Dirección', 'cantidad': 'Cantidad'}
table = dash_table.DataTable(df[df['recoleccion'] == False].to_dict('records'), [{"name": dictionary[i], "id": i} for i in ['localidad', 'direccion', 'cantidad']], id='table')
'''

layout = html.Div(children=[
    dbc.Row([
        dbc.Col([
            dl.Map(style={'width': '100%', 'height': '100vh', 'margin': "auto", "display": "block"},
                               zoom=11.25, id="map2")
        ]),
        dbc.Col([
            html.H1(children='Puntos Pendientes'),
            html.Div(children='''
                Los siguientes puntos se encuentran pendientes de recolección.
            '''),
            dash_table.DataTable(map_plotting()[2],[{"name": dictionary[i], "id": i} for i in ['localidad', 'direccion', 'cantidad']], id='table'),
            dbc.Alert(id='tbl_out'),
            html.Button('Actualizar', id='update', n_clicks=0),

        ]),
    ])

])

@callback(
    Output('map2', 'children'),
    Output('map2', 'center'),
    Output('table', 'data'),
    Output('tbl_out', 'children'),
    Input('update', 'n_clicks'),
    Input('table', 'active_cell')
)
def updating(input, input2):

    #df=x[3]
    if input2:
        i = input2['row']
        x = map_plotting(i)
        message = ""
        for j,k in zip(['bicicleta', 'motocicleta', 'automovil13', 'automovil14', 'automovil15',
                         'camioneta16', 'camioneta17', 'camioneta18', 'camioneta19', 'especiales'],
                       ['Bicicleta', 'Motocicleta', 'Automóvil 13\"', 'Automóvil 14\"', 'Automóvil 15\"',
                         'Camioneta 16\"', 'Camioneta 17\"', 'Camioneta 18\"', 'Camioneta 19\"-22\"', 'Especiales y Maquinaria'] ):
            if x[3][j].iloc[i] > 0:
                message += f"|{k}:\t {int(x[3][j].iloc[i])} |"

    else:
        x = map_plotting()
        message = "Seleccione una celda"

    return x[0], x[1], x[2], message





