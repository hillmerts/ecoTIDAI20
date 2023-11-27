import copy
import numpy as np
import pandas as pd
import utm
import pickle
from sklearn.cluster import KMeans
from pymoo.algorithms.soo.nonconvex.ga import GA
from pymoo.optimize import minimize
from pymoo.operators.sampling.rnd import PermutationRandomSampling
from pymoo.operators.crossover.ox import OrderCrossover
from pymoo.operators.mutation.inversion import InversionMutation
from pymoo.termination.default import DefaultSingleObjectiveTermination
from pymoo.core.problem import ElementwiseProblem
from pymoo.core.repair import Repair
import os


class RecolectionRoute(ElementwiseProblem):

    def __init__(self, x,y,D,maxdist,tires,inclustdis,**kwargs):
   
        n_points = len(x)
        self.maxdist = maxdist
        #self.xini=xini
        #self.yini=yini

        self.x = x
        self.y = y
        self.tires = tires
        self.D = D
        self.inclustdis = inclustdis
        self.cities=np.column_stack((x, y))
        self.max = len(x)

        super(RecolectionRoute, self).__init__(
            n_var=n_points,
            n_obj=1,
            xl=0,
            xu=n_points,
            vtype=int,
            **kwargs
        )

    def _evaluate(self, x, out, *args, **kwargs):
        out["F"] = self.get_route_neumatics(x)
        #out["G"] = self.get_route_neumatics(x)
        #print(out['F'],out['G'])


    def get_route_length(self, x):
        n_points = len(x)
        dist = 0
        param = 0
        for k in range(n_points - 1):
            i, j = x[k], x[k + 1]
            dist += self.D[i, j]
            param = k
            if (dist >= self.maxdist):
                #print('break')
                break
        self.max = param

    

        last, first = x[k], x[0]
        dist += self.D[last, -1]  # back to the initial recolection point
        dist += self.D[first, -1]
        return dist

    def get_route_neumatics(self, x):
        n_points = len(x)
        dist = 0
        q = 0
        for k in range(n_points - 1):
            i, j = x[k], x[k + 1]
            dist += self.D[i, j]/60.0 
            q = q +  (self.tires[k] + self.tires[k + 1])*0.5
            dist += 2.3*(self.tires[k] + self.tires[k + 1])*0.5 + self.inclustdis[k]
            param = k
            
            if (dist >= self.maxdist):
                break
            self.max = param
        return -q
    

def inform(problem, x):
    retvec = []
    retdist = []
    rettires = []
    for i in range(problem.max + 1):
        retvec.append(x[i])
    for i in range(problem.max ):        
        retdist.append(problem.D[x[i], x[i+1]]/60.0 + 
                       2.3*(problem.tires[x[i]] + problem.tires[x[i+ 1]])*0.5 + problem.inclustdis[ x[i] ]) 
    for i in range(problem.max+1):        
        rettires.append(problem.tires[x[i]])
    return retvec, retdist,rettires


class StartFromZeroRepair(Repair):

    def _do(self, problem, X, **kwargs):
        I = np.where(X == 0)[1]

        for k in range(len(X)):
            i = I[k]
            X[k] = np.concatenate([X[k, i:], X[k, :i]])

        return X


def routeinit(data):
    centralfile = pd.ExcelFile('../Dataset/Basededatosllantas.xlsx')
    names = centralfile.sheet_names
    PuntoRecoFijo   = pd.read_excel(centralfile,names[0])
    PQRS            = pd.read_excel(centralfile,names[1])
    Vehiculo        = pd.read_excel(centralfile,names[2])
    TamaLlantas     = pd.read_excel(centralfile,names[3])
    TipoLLantas     = pd.read_excel(centralfile,names[4])
    RecoleccionLoca = pd.read_excel(centralfile,names[5])
    hoja2           = pd.read_excel(centralfile,names[6])
    hoja9           = pd.read_excel(centralfile,names[7])
    SRS             = pd.read_excel(centralfile,names[8])
    A = PQRS[PQRS['TOTAL Completas']!=0][['Latitud ','Longitud','TOTAL Completas']]
    A['x'] = A['Latitud ']/1000000
    A['y'] = A['Longitud']/1000000

    A = A[A['x'] > 4 ]
    A = A[A['x'] < 5 ]

    A = A[A['y'] > -75 ]
    A = A[A['y'] < -73 ]

    W = A[['x','y']]
    i=50
    kmeans = KMeans(n_clusters = i, init = 'k-means++', random_state = 42)
    kmeans.fit(W)
    T = W.copy()
    T['Cluster'] = kmeans.predict(W)
    T['tires'] = A['TOTAL Completas']
    #color = list(mcolors.CSS4_COLORS.values())
    nClusters = i

    T['numtire']=A['TOTAL Completas']

    
    xvec = []
    yvec=[]
    tires = []
    interdist = []
    for i in range(0,nClusters):
        cluster = T[T['Cluster'] == i]
        xs = 0
        ys = 0
        ts = 0
        for j in range(0,len(cluster)):
            print(cluster['x'].iloc[j] , cluster['y'].iloc[j])
            #x, y, s1, s2 = utm.from_latlon( cluster['x'].iloc[j] , cluster['y'].iloc[j] )
            x = cluster['x'].iloc[j]
            y = cluster['y'].iloc[j]
            xs = xs + x
            ys = ys + y
            ts = cluster['tires'].iloc[j]
            #plt.plot(x,y,'go',alpha=0.5)
        interdist.append(len(cluster)*1.32)
        xs = xs/len(cluster)
        ys = ys/len(cluster)
        #plt.plot(xs,ys,'bo',alpha=0.6)
        xvec.append(xs)
        yvec.append(ys)
        tires.append(ts)
        pickle.dump(kmeans, open("classification_model.pkl", "wb"))
    
    return T, kmeans,xvec,yvec,interdist, tires

def route_configuration(data):
    kmeans = pickle.load(open(os.path.join('route_optimization','classification_model.pkl'), 'rb'))

    A = pd.DataFrame()

    print('lat: ', data['latitud'])
    print('long: ', data['longitud'])
    print('total_llantas: ', data['total_llantas'])

    A['x'] = data['latitud'].tolist()
    A['y'] = data['longitud'].tolist()
    A['tires'] = data['total_llantas'].tolist()

    print(A)

    A = A[A['x'] > 4 ]
    A = A[A['x'] < 5 ]

    A = A[A['y'] > -75 ]
    A = A[A['y'] < -73 ]

    W = A[['x','y']]
    T = W.copy()
    T['Cluster'] = kmeans.predict(W)
    T['tires'] = A['tires']
    #color = list(mcolors.CSS4_COLORS.values())
    nClusters = 50
    
    xvec = []
    yvec=[]
    tires = []
    interdist = []
    for i in range(0,nClusters):
        cluster = T[T['Cluster'] == i]
        if len(cluster) > 0:
            xs = 0
            ys = 0
            ts = 0
            for j in range(0,len(cluster)):
                print(cluster['x'].iloc[j] , cluster['y'].iloc[j])
                #x, y, s1, s2 = utm.from_latlon( cluster['x'].iloc[j] , cluster['y'].iloc[j] )
                x = cluster['x'].iloc[j]
                y = cluster['y'].iloc[j]
                xs = xs + x
                ys = ys + y
                ts = cluster['tires'].iloc[j]
                #plt.plot(x,y,'go',alpha=0.5)
            interdist.append(len(cluster)*1.32)
            xs = xs/len(cluster)
            ys = ys/len(cluster)
            #plt.plot(xs,ys,'bo',alpha=0.6)
            xvec.append(xs)
            yvec.append(ys)
            tires.append(ts)
    
    return T,xvec,yvec,interdist,tires


def routeopt(maxtime,tires,xvec,yvec,interdist):
    Dmat = np.loadtxt(os.path.join('route_optimization','outfileDmat.txt'))

    xpart, ypart, s1, s2 = utm.from_latlon( -74.10622205211465,4.710107141594455 )

    Dmatcopy = copy.deepcopy(Dmat)
    xvecn     =copy.deepcopy(xvec)
    yvecn=copy.deepcopy(yvec)
    tiresn=copy.deepcopy(tires)
    
    interdistn=copy.deepcopy(interdist)

    print("xvec: ", xvecn)
    print("yvec: ", yvecn)
    print("tires: ", tiresn)
    print("interdist: ", interdistn)
    routesvec  = []
    s = 0
    clust = list(np.arange(len(yvec)))
    while len(xvecn) > 5:

        problem = RecolectionRoute(xvecn,yvecn,Dmatcopy,maxtime,tiresn,interdistn)

        algorithm = GA(
            pop_size=4000,
            sampling=PermutationRandomSampling(),
            mutation=InversionMutation(),
            crossover=OrderCrossover(),
            repair=StartFromZeroRepair(),
            eliminate_duplicates=True
        )

        # if the algorithm did not improve the last 200 generations then it will terminate (and disable the max generations)
        termination = DefaultSingleObjectiveTermination(period=50, n_max_gen=np.inf)

        res = minimize(
            problem,
            algorithm,
            termination,
            seed=98
        )

        route, dist, tires = inform(problem, res.X)
        dist.append(0.0)
        #figure = visualize(problem, res.X)
        #figure.savefig("output"+str(s)+".png")
        #route.sort(reverse=True)
        data = pd.DataFrame(route,columns=['points'])

        #print(route)
        #print(data)

        #print(dist)

        #print(tires)

        data['x']=data['points'].map(lambda x: xvec[x])
        data['y']=data['points'].map(lambda x: yvec[x])
        data['cluster']=data['points'].map(lambda x: clust[x])
        data['tires']= tires
        data['distance']=dist
        data['case'] = s

        
                        
        s = s + 1
        route.sort(reverse=True)
        for i in range(len(route)):
            xvecn.pop(route[i])
            yvecn.pop(route[i])
            clust.pop(route[i])
            #Dmatcopy
            Dmatcopy = np.delete(Dmatcopy, route[i], 0)
            Dmatcopy = np.delete(Dmatcopy, route[i], 1)
            tiresn.pop(route[i])
            interdistn.pop(route[i])
        routesvec.append(data)

    return routesvec


def get_route(data):
    T ,xvec,yvec,interdist, tires = route_configuration(data)
    routesvec = routeopt(600,tires,xvec,yvec,interdist)
    return [route.to_dict('records') for route in routesvec][0]
