import dash
from dash import html, dcc, Input, Output, ctx, Dash,callback
import pandas as pd
import dash_leaflet as dl
import dash_bootstrap_components as dbc



dash.register_page(__name__, path='/')

app = Dash(__name__)



layout = html.Div([
    html.H2(children= 'Bienvenido a',
                 style = {'display': 'flex', 'justify-content': 'center'}),
    html.H1(children='EcoTiDAI',
            style={'display': 'flex', 'justify-content': 'center'})
    ])


