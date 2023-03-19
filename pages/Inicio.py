import dash
from dash import html, dcc, Input, Output, ctx, Dash,callback
import pandas as pd
import dash_bootstrap_components as dbc
import dash_leaflet as dl
import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent.parent.parent))
from backend import points_def



#app = Dash(__name__)

dash.register_page(__name__, path='/historico')

app = Dash(__name__)


button = html.Div(
    [
        dbc.Button("Todos", id='todos', n_clicks=0),
        dbc.Button("Arrojos Clandestinos", id='clandestino', n_clicks=0),
        dbc.Button("Puntos Críticos", id='criticos', n_clicks=0),
        html.Div(id='container-button-timestamp')
    ],
    style={"text-align":"center"}
)

layout = html.Div(children=[

    dbc.Row([
        dbc.Col([
            dl.Map(style={'width': '100%', 'height': '80vh', 'margin': "auto", "display": "block"},
                   children= [dl.TileLayer(), dl.MarkerClusterGroup(id='markers', children = [dl.Marker(**city) for city in points_def()])],
                   zoom=11.25, id="map", center=[4.660603, -74.105759]),
            html.Br(),
            button,

        ]),
        dbc.Col([
            html.Hr(),
            dbc.Row([
                dbc.Col([
                    html.H3(children = 'Neumáticos recogidos',style={"text-align":"center"}),
                    html.H1(children='25820',style={"text-align":"center"}),
                    html.P(children='Desde el 1 de enero de 2023.', style={"text-align":"center"})
                ]),
                dbc.Col([
                    html.H3(children='PQRS por atender', style={"text-align": "center"}),
                    html.H1(children='45', style={"text-align": "center"})
                ])
            ]),
            html.Hr(),
            dbc.Row([
                dbc.Col([
                    html.H3(children='Ubicaciones atendidas', style={"text-align": "center"}),
                    html.H1(children='258340', style={"text-align": "center"}),
                    html.P(children='Desde el 1 de enero de 2023.', style={"text-align": "center"})
                ]),
                dbc.Col([
                    html.H3(children='Kilómetros recorridos', style={"text-align": "center"}),
                    html.H1(children='45465', style={"text-align": "center"}),
                    html.P(children='Desde el 1 de enero de 2023.', style={"text-align": "center"})
                ])
            ])

        ]),

    ])

])

'''
@callback(
    Output('map','children'),
    Output('map','center'),
    Input('todos', 'n_clicks'),
    Input('clandestino', 'n_clicks'),
    Input('criticos', 'n_clicks')
)
def update_map(but1,but2, but3):
    arrojo_clandestino, punto_critico = 2==3, 1==0
    if 'clandestino' == ctx.triggered_id:
        arrojo_clandestino, punto_critico = 1==1, 1=='1'
    elif 'criticos' == ctx.triggered_id:
        arrojo_clandestino, punto_critico = 1==3, 1==int('1')
    elif 'todos' == ctx.triggered_id:
        arrojo_clandestino, punto_critico = not str(1)=='1', 4=='5'

    return map_plotting(arrojo_clandestino, punto_critico)

'''

'''
import dash
from dash import html, dcc, Input, Output, ctx, Dash,callback
import pandas as pd
import dash_leaflet as dl
import dash_bootstrap_components as dbc


def points_def(route, arrojo_clandestino = False, punto_critico = False):

    dictionary = pd.read_excel(route)
    if arrojo_clandestino and punto_critico:
        dictionary = dictionary[dictionary['Arrojo Clandestino'] == 'SI' ][dictionary['Punto crítico'] == 'SI'].to_dict(orient='list')
    elif punto_critico:
        dictionary = dictionary[dictionary['Punto crítico'] == 'SI'].to_dict(orient='list')
    elif arrojo_clandestino:
        dictionary = dictionary[dictionary['Arrojo Clandestino'] == 'SI'].to_dict(orient='list')
    else:
        dictionary = dictionary.to_dict(orient='list')

    return [{'title': dictionary['Fecha de visita'][k],
               'position': [dictionary['y'][k], dictionary['x'][k]],
               } for k in range(len(dictionary['ObjectID']))]



def map_plotting(arrojo_clandestino = False, punto_critico = False):
    points = points_def("../../Dataset/PC.xlsx", arrojo_clandestino, punto_critico)

    markers = [dl.Marker(**city) for city in points]
    cluster = dl.MarkerClusterGroup(id='markers', children = markers)
    return [dl.TileLayer(), cluster]#, [sum([x['position'][0] for x in points])/len(points), sum([x['position'][1] for x in points])/len(points)]
#app = Dash(__name__)

dash.register_page(__name__, path='/historico')

app = Dash(__name__)


button = html.Div(
    [
        dbc.Button("Todos", id='todos', n_clicks=0),
        dbc.Button("Arrojos Clandestinos", id='clandestino', n_clicks=0),
        dbc.Button("Puntos Críticos", id='criticos', n_clicks=0),
        html.Div(id='container-button-timestamp')
    ],
    style={"text-align":"center"}
)

layout = html.Div(children=[
    dbc.Row(html.H1(children='Monitoreo', style={'textAlign': 'center'})),            html.Hr(),

    dbc.Row([
        dbc.Col([
            dl.Map(style={'width': '100%', 'height': '65vh', 'margin': "auto", "display": "block"},
                   zoom=11.25, id="map", center=[4.660603, -74.105759]),
            html.Br(),
            button,

        ]),
        dbc.Col([
            dbc.Row([
                dbc.Col([
                    html.H3(children = 'Neumáticos recogidos',style={"text-align":"center"}),
                    html.H1(children='25820',style={"text-align":"center"}),
                    html.P(children='Desde el 1 de enero de 2023.', style={"text-align":"center"})
                ]),
                dbc.Col([
                    html.H3(children='PQRS por atender', style={"text-align": "center"}),
                    html.H1(children='45', style={"text-align": "center"})
                ])
            ]),
            html.Hr(),
            dbc.Row([
                dbc.Col([
                    html.H3(children='Ubicaciones atendidas', style={"text-align": "center"}),
                    html.H1(children='258340', style={"text-align": "center"}),
                    html.P(children='Desde el 1 de enero de 2023.', style={"text-align": "center"})
                ]),
                dbc.Col([
                    html.H3(children='Kilómetros recorridos', style={"text-align": "center"}),
                    html.H1(children='45465', style={"text-align": "center"}),
                    html.P(children='Desde el 1 de enero de 2023.', style={"text-align": "center"})
                ])
            ])

        ]),

    ])

])

@callback(
    Output('map','children'),
    Input('todos', 'n_clicks'),
    Input('clandestino', 'n_clicks'),
    Input('criticos', 'n_clicks')
)
def update_map(but1,but2, but3):
    arrojo_clandestino, punto_critico = 2==3, 1==0
    if 'clandestino' == ctx.triggered_id:
        arrojo_clandestino, punto_critico = 1==1, 1=='1'
    elif 'criticos' == ctx.triggered_id:
        arrojo_clandestino, punto_critico = 1==3, 1==int('1')
    elif 'todos' == ctx.triggered_id:
        arrojo_clandestino, punto_critico = not str(1)=='1', 4=='5'

    return map_plotting(arrojo_clandestino, punto_critico)


'''
