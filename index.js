import osmnx as ox
import networkx as nx
import plotly.graph_objects as go
import numpy as np

state = ox.gdf_from_place('Georgia, US')
ox.plot_shape(ox.project_gdf(state))

# Defining the map boundaries
north, east, south, west = 33.798, -84.378, 33.763, -84.422

# Downloading the map as a graph object
G = ox.graph_from_bbox(north, south, east, west, network_type = 'drive')

# Plotting the map graph
ox.plot_graph(G)

# Displaying the 3rd node
list(G.nodes(data=True))[2]

# Displaying the 1st edge
list(G.edges(data=True))[1]

# Displaying the shape of edge using the geometry
list(G.edges(data=True))[1][2]['geometry']

# define origin and desination locations
origin_point = (33.787201, -84.405076)
destination_point = (33.764135, -84.394980)

# get the nearest nodes to the locations
origin_node = ox.get_nearest_node(G, origin_point)
destination_node = ox.get_nearest_node(G, destination_point)

# printing the closest node id to origin and destination points
origin_node = ox.get_nearest_node

# Finding the optimal path
route = nx.shortest_path(G, origin_node, destination_node, weight = 'length')
route

# getting coordinates of the nodes

# we will store the longitudes and latitudes in following list
long = []
lat = []

for i in route:
    point = G.nodes[i]
    long.append(point['x'])
    lat.append(point['y'])

def plot_path(lat, long, origin_point, destination_point):

      """
      Given a list of latitudes and longitudes, origin
      and destination point, plots a path on a map

      Parameters
      ----------
      lat, long: list of latitudes and longitudes
      origin_point, destination_point: co-ordinates of origin
      and destination
      Returns
      -------
      Nothing. Only shows the map.
      """

      # adding the lines joining the nodes
      fig = go.Figure(go.Scattermapbox(
          name = "Path",
          mode = "lines",
          lon = long,
          lat = lat,
          marker = {'size': 10},
          line = dict(width = 4.5, color = 'blue')))

      # adding source marker
      fig.add_trace(go.Scattermapbox(
          name = "Source",
          mode = "markers",
          lon = [origin_point[1]],
          lat = [origin_point[0]],
          marker = {'size': 12, 'color':"red"}))

      # adding destination marker
      fig.add_trace(go.Scattermapbox(
          name = "Destination",
          mode = "markers",
          lon = [destination_point[1]],
          lat = [destination_point[0]],
          marker = {'size': 12, 'color':'green'}))

      # getting center for plots:
      lat_center = np.mean(lat)
      long_center = np.mean(long)

      # defining the layout using mapbox_style
      fig.update_layout(mapbox_style="stamen-terrain", mapbox_center_lat = 30, mapbox_center_lon=-80)
      fig.update_layout(margin={"r":0,"t":0,"l":0,"b":0},
                       mapbox = {
                           'center': {'lat': lat_center, 'lon': long_center},
                           'zoom': 13})

      fig.show()

plot_path(lat, long, origin_point, destination_point)

# Getting the start and end node of this part
start_node=route[-7]
end_node=route[-6]

# Getting the edge connecting these nodes and storing it as a list in z to maintain the data structure of G.edges
z = []

for i in list(G.edges(data=True)):
    if (i[0]==start_node) & (i[1]==end_node):
        z.append(i)

z[0][2]['geometry']

def node_list_to_path(G, node_list):
    """
    Given a list of nodes, return a list of lines that together follow the path
    defined by the list of nodes.
    Parameters
    ----------
    G : networkx multidigraph
    route : list
        the route as a list of nodes
    Returns
    -------
    lines : list of lines given as pairs ( (x_start, y_start), (x_stop, y_stop) )
    """
    edge_nodes = list(zip(node_list[:-1], node_list[1:]))
    lines = []
    for u, v in edge_nodes:
        # if there are parallel edges, select the shortest in length
        data = min(G.get_edge_data(u, v).values(), key=lambda x: x['length'])

        # if it has a geometry attribute (ie, a list of line segments)
        if 'geometry' in data:
            # add them to the list of lines to plot
            xs, ys = data['geometry'].xy
            lines.append(list(zip(xs, ys)))
        else:
            # if it doesn't have a geometry attribute, the edge is a straight
            # line from node to node
            x1 = G.nodes[u]['x']
            y1 = G.nodes[u]['y']
            x2 = G.nodes[v]['x']
            y2 = G.nodes[v]['y']
            line = [(x1, y1), (x2, y2)]
            lines.append(line)
    return lines

# getting the list of coordinates from the path (which is a list of nodes)
lines = node_list_to_path(G, route)

long2 = []
lat2 = []

for i in range(len(lines)):
    z = list(lines[i])
    l1 = list(list(zip(*z))[0])
    l2 = list(list(zip(*z))[1])
    for j in range(len(l1)):
        long2.append(l1[j])
        lat2.append(l2[j])
        print("Length of lat: ", len(lat))
        print("Length of lat2: ", len(lat2)

plot_path(lat2, long2, origin_point, destination_point)
