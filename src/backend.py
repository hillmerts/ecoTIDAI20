import pandas as pd
import sys
import uuid
import geocoder
import datetime

def hillmert():
    print('Jiliaaaar')


def PQRS():
    route = 'src/' +'Dataset/Basededatosllantas.xlsx'

    dictionary = pd.read_excel(route, sheet_name='PQRS')
    cols = ['Fecha Operativo', 'Direccion', 'Latitud ', 'Longitud', 'LOCALIDAD', 'Bicicleta','Motocicleta','Automovil 13"','Automovil 14"',
            'Automovil 15"', 'Camioneta 16"','Camioneta 17"','Camioneta 18"',
            'Camion 19" a 22,5"',	'Especial y/o maquinaria ', 'Total Fraccionada']


    dictionary['ID'] = dictionary[cols].apply(lambda _: uuid.uuid4(), axis=1)

    return dictionary[['ID']+cols].dropna(how='any')


def points_def():
    dictionary = PQRS()
    print(dictionary.head())
    dictionary = dictionary.to_dict(orient='list')
    return [{'title': dictionary['Fecha Operativo'][k],
               'position': [dictionary['Latitud '][k]*1e-6, dictionary['Longitud'][k]*1e-6]
               } for k in range(len(dictionary['Direccion']))]


def submission(localidad, direccion, x1,x2,x3,x4,x5,x6,x7,x8,x9,x10):
    if len(direccion)>0:
        try:
            latlog = geocoder.osm(direccion+', Bogota, Colombia').latlng
            if (latlog[0] > -74.009113 or latlog[0] < -74.264180) and (latlog[1] > 4.782062 or latlog[1] < 4.476517) and (
                    pd.Series([x1, x2, x3, x4, x5, x6, x7, x8, x9, x10]).sum()>0) :
                dataframe = pd.DataFrame(
                    {

                                'Fecha Operativo': datetime.datetime.now(),
                                'Direccion': [direccion],
                                'Latitud ': latlog[0]* 1e6,
                                'Longitud': latlog[1]*1e6,
                                'LOCALIDAD': [localidad],
                                'Bicicleta':[x1],
                                'Motocicleta':[x2],
                                'Automovil 13"':[x3],
                                'Automovil 14"':[x4],
                                'Automovil 15"':[x5],
                                'Camioneta 16"':[x6],
                                'Camioneta 17"':[x7],
                                'Camioneta 18"':[x8],
                                'Camion 19" a 22,5"':[x9],
                                'Especial y/o maquinaria ':[x10],
                                'Total Fraccionada':[0]
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
    else:
        return 'El campo dirección se encuentra vacío.'

