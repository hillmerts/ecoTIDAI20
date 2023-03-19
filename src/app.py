from dash import Dash, html, dcc
import dash_bootstrap_components as dbc
import plotly.express as px
from dash.dependencies import Input, Output
from dash_bootstrap_templates import load_figure_template
import dash_leaflet as dl

import pandas as pd
import dash

app = Dash(__name__, use_pages=True,external_stylesheets=[dbc.themes.FLATLY])
load_figure_template('LUX')

server = app.server

# padding for the page content
CONTENT_STYLE = {
    "margin-left": "18rem",
    "margin-right": "2rem",
    "padding": "2rem 1rem",
    "align": 'center'
}

navbar = dbc.NavbarSimple(
    children=  [

            dbc.NavItem(dbc.NavLink(page, href=path))

            for page, path in
                zip(['Histórico', 'Puntos Pendientes', 'Añadir Punto', 'Próxima Ruta'],
                    ['historico', 'pendiente', 'anadir', 'proxima'])
        ],
    brand="EcoTiDAI",
    brand_href="",
    color="primary",
    dark=True,
)



content = html.Div(id="page-content", children=[], style=CONTENT_STYLE)

app.layout = html.Div([
    dcc.Location(id="url"),
    navbar,
    dash.page_container
])


if __name__ == '__main__':
	app.run_server(debug=True, port=80)
