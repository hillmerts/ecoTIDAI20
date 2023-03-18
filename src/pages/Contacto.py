from dash import html, dcc, Input, Output, ctx, Dash, callback, dash_table, register_page
import pandas as pd
import dash_leaflet as dl
import dash_bootstrap_components as dbc
import os
import sys
import pickle
import numpy as np
from .codeforcreatingroutes import routeopt
register_page(__name__,path='/proxima')

def clusterassign(input):
    input = input[input.recoleccion==False].fillna(0)
    model = pickle.load(open("./pages/classification_model.pkl", "rb"))
    input['cluster'] = model.predict([[h,w] for h,w in zip(input.latitud.values, input.longitud.values)])
    input['volume'] = input[['bicicleta', 'motocicleta', 'automovil13', 'automovil14', 'automovil15',
                         'camioneta16', 'camioneta17', 'camioneta18', 'camioneta19', 'especiales']].apply(lambda x:
                            np.dot(x,[1/864,1/128,1/300,1/128,1/63,1/63,1/63,1/144,1/80,1/4]), axis=1)
    grouping = input.groupby('cluster').sum()
    res = 50*[0.0]
    for i in grouping.index:
        res[i] = grouping['volume'].loc[i]
    return res, input

#print(routeopt(125,clusterassign(pd.read_csv('../../Dataset/pendientes.csv'))[0]))


def map_plotting():
    df = pd.DataFrame(columns=['localidad', 'direccion', 'latitud', 'longitud', 'cantidad'])
    points = [{'title': df['direccion'][k],
               'position': [df['latitud'][k], dictionary['longitud'][k]],
               } for k in range(len(df))]
    dictionary = {'localidad': 'Localidad', 'direccion': 'Dirección', 'cantidad': 'Cantidad'}
    markers = [dl.Marker(**city) for city in points]
    cluster = dl.MarkerClusterGroup(id='markers', children = markers)
    try:
        center = [sum([x['position'][0] for x in points])/len(points), sum([x['position'][1] for x in points])/len(points)]
    except:
        center = [4.6097100, -74.0817500]
    return ([dl.TileLayer()]+[dl.Marker(**city) for city in points],
            center,
            dash_table.DataTable(df.to_dict('records'),[{"name": dictionary[i], "id": i} for i in ['localidad', 'direccion', 'cantidad']], id='table_route')
            )



layout = html.Div(children=[
    dbc.Row(
        [
            dbc.Col(
                dl.Map(style={'width': '100%', 'height': '100vh', 'margin': "auto", "display": "block"},
                       zoom=11.25, id="map", center=map_plotting()[1], children=map_plotting()[0])
            ),
            dbc.Col(
                [
                    html.H2(children = 'Ruta Óptima'),
                    map_plotting()[2],
                    html.Button('Marcar como recogida', id='submit-val', n_clicks=0)


                ]
            )

        ]


    )


])

@callback(
    Output('table_route', 'data'),
    Input('submit-val', 'n_clicks')
)
def funct(input):
    if input > 0:
        df = pd.DataFrame({'localidad': ['Ciudad Bolivar'], 'direccion': ['hillmert'], 'cantidad': [8]})
        return df.to_dict('records')


if __name__ == '__main__':
    main()