from dash import html, dcc, register_page, callback, ctx, Input, Output, State
import dash_bootstrap_components as dbc
import pandas as pd


register_page(__name__,path='/anadir')

text_input = html.Div(
    [

        dbc.Label("Localidad"),
        dcc.Dropdown(
            ["Usaquén", "Chapinero", "Santa Fe", "San Cristóbal", "Usme", "Tunjuelito", "Bosa", "Kennedy", "Fontibón",
             "Engativá", "Suba", "Barrios Unidos", "Teusaquillo", "Los Mártires", "Antonio Nariño", "Puente Aranda",
             "La Candelaria", "Rafael Uribe Uribe", "Ciudad Bolívar"], 'Ciudad Bolívar', id='localidad',
            style={'width': '50%'}),
        dbc.Label("Dirección"),
        dbc.Input(placeholder="Inserte la direccion aquí...", type="text", style={'width': '50%'}, id="direccion"),
        html.H5(" "),
        html.H5("Cantidad de Neumáticos"),
        dbc.Row(
            [
                dbc.Col([
                    dbc.Label("Bicicleta"),
                    dbc.Input(placeholder="Inserte la cantidad...", type="number", style={'width': '50%'}, id="bicicleta"),
                    dbc.Label("Motocicleta"),
                    dbc.Input(placeholder="Inserte la cantidad...", type="number", style={'width': '50%'}, id="motocicleta"),
                    dbc.Label("Automóvil 13 pulgadas"),
                    dbc.Input(placeholder="Inserte la cantidad...", type="number", style={'width': '50%'}, id="automovil13"),
                    dbc.Label("Automóvil 14 pulgadas"),
                    dbc.Input(placeholder="Inserte la cantidad...", type="number", style={'width': '50%'}, id="automovil14"),
                    dbc.Label("Automóvil 15 pulgadas"),
                    dbc.Input(placeholder="Inserte la cantidad...", type="number", style={'width': '50%'}, id="automovil15")
                ]),
                dbc.Col([
                    dbc.Label("Camioneta 16 pulgadas"),
                    dbc.Input(placeholder="Inserte la cantidad...", type="number", style={'width': '50%'},
                              id="camioneta16"),
                    dbc.Label("Camioneta 17 pulgadas"),
                    dbc.Input(placeholder="Inserte la cantidad...", type="number", style={'width': '50%'},
                              id="camioneta17"),
                    dbc.Label("Camioneta 18 pulgadas"),
                    dbc.Input(placeholder="Inserte la cantidad...", type="number", style={'width': '50%'},
                              id="camioneta18"),
                    dbc.Label("Camioneta 19 a 22.5 pulgadas"),
                    dbc.Input(placeholder="Inserte la cantidad...", type="number", style={'width': '50%'},
                              id="camioneta19"),
                    dbc.Label("Especiales y/o maquinaria"),
                    dbc.Input(placeholder="Inserte la cantidad...", type="number", style={'width': '50%'},
                              id="especiales"),
                    # dbc.FormText(""),
                ])
            ], style={'width': '60%'})
    ]
)

layout = html.Div(children=[
    html.H1(children='Recepción de rutas'),
    text_input,
    html.Button('Enviar', id='submit-val', n_clicks=0),
    html.Div(id='message'),

],  style={ "margin-left": "75px"})


@callback(
    Output('message','children'),
    Input('submit-val', 'n_clicks'),
    State('localidad', 'value'),
    State('direccion', 'value'),
    State('bicicleta', 'value'),
    State('motocicleta', 'value'),
    State('automovil13', 'value'),
    State('automovil14', 'value'),
    State('automovil15', 'value'),
    State('camioneta16', 'value'),
    State('camioneta17', 'value'),
    State('camioneta18', 'value'),
    State('camioneta19', 'value'),
    State('especiales', 'value')
)
def submit(input, localidad, direccion, x1,x2,x3,x4,x5,x6,x7,x8,x9,x10):
    if input>0 and len(direccion)>0:
        try:
            latlog = geocoder.osm(direccion+', Bogota, Colombia').latlng
            if (latlog[0] > -74.009113 or latlog[0] < -74.264180) and (latlog[1] > 4.782062 or latlog[1] < 4.476517) and (
                    pd.Series([x1, x2, x3, x4, x5, x6, x7, x8, x9, x10]).sum()>0) :
                dataframe = pd.DataFrame(
                    {
                                'date': datetime.datetime.now(),
                                'localidad': [localidad],
                                'direccion': [direccion],
                                'latitud': latlog[0],
                                'longitud': latlog[1],
                                'bicicleta': [x1],
                                'motocicleta': [x2],
                                'automovil13': [x3],
                                'automovil14': [x4],
                                'automovil15': [x5],
                                'camioneta16': [x6],
                                'camioneta17': [x7],
                                'camioneta18': [x8],
                                'camioneta19': [x9],
                                'especiales': [x10],
                                'recoleccion': False
                    }
                )
                pd.read_csv('../../Dataset/pendientes.csv').append(dataframe, ignore_index=True).to_csv('../../Dataset/pendientes.csv', index=False)
                return 'Los datos se han registrado de forma correcta.'
            elif pd.Series([x1, x2, x3, x4, x5, x6, x7, x8, x9, x10]).sum()>0:
                return 'La dirección dada no se localiza en Bogotá D.C. y alrededores.'
            else:
                return 'No se ha ingresado un número de neumáticos mayor a cero.'
        except:
            return 'La dirección ingresada no es válida.'
    elif input>0:
        return 'El campo dirección se encuentra vacío.'
    else:
        return 'Pulse el botón Enviar al suministrar los datos.'
