// https://www.thomaswilburn.net/typedefs/graph/weighted/weighted-graph.js

export class WeightedGraph {
	constructor(vertexes, edges, directed) {
		this.vertexes = vertexes || [];
		this.edges = edges || [];
		this.componentMap = [];
		this.directed = directed || false;
	}

	addEdge(from, to, weight, directed) {
		directed = directed || this.directed;

		if (!this.edges[from]) this.edges[from] = [];
		this.edges[from].push({
			to: to,
			weight: weight || Infinity
		});

		if (!directed) {
			this.addEdge(to, from, weight, true);
		}

	}

	breadthFirst(start, f) {
		if (typeof start == 'function') {
			f = start;
			start = 0;
		}
		f = f || function() {};
		f(this.vertexes[start], this.edges[start], start);
		var queue = this.edges[start].slice();
		var visited = [];
		visited[start] = true;
		var edge;
		while (edge = queue.shift()) {
			if (visited[edge.to]) continue;
			visited[edge.to] = true;
			f(this.vertexes[edge.to], this.edges[edge.to], edge.to);
			var edges = this.edges[edge.to];
			queue = queue.concat(edges);
		}
	}

	depthFirst(start, f) {
		if (typeof start == 'function') {
			f = start;
			start = 0;
		}
		f = f || function() {};
		var visited = [];
		var self = this;
		var walk = function(nodeIndex) {
			visited[nodeIndex] = true;
			var node = self.vertexes[nodeIndex];
			var edges = self.edges[nodeIndex];
			f(node, edges, nodeIndex);
			for (var i = 0; i < edges.length; i++) {
				var edge = edges[i];
				if (!visited[edge.to]) {
					walk(edge.to);
				}
			}
		}
		walk(start);
	}

	findMST(start) {
		var v = start || 0;
		var inTree = [];
		var distance = this.edges.map(function() { return Infinity });

		var tree = [];
		tree[v] = null;

		while (inTree[v] !== true) {
			inTree[v] = true;

			var edges = this.edges[v];
			for (var i = 0; i < edges.length; i++) {
				var edge = edges[i];
				if (distance[edge.to] > edge.weight && !inTree[edge.to]) {
					distance[edge.to] = edge.weight;
					tree[edge.to] = {to: v, weight: edge.weight};
				}
			}

			var d = Infinity;
			for (var i = 0; i < distance.length; i++) {
				if (!inTree[i] && distance[i] < d) {
					d = distance[i];
					v = i;
				}
			}

		}

		var newGraph = new WeightedGraph(this.vertexes);
		for (var i = 0; i < tree.length; i++) {
			if (tree[i]) newGraph.addEdge(i, tree[i].to, tree[i].weight);
		}
		return newGraph;
	}

	mst3K(start) {
		var self = this;
		var v = start || 0;
		var distance = [Infinity];
		for (var i = 0; i < this.edges[v].length; i++) {
			var edge = this.edges[v][i];
			distance[edge.to] = edge.weight;
		}

		var tree = [];
		tree[v] = null;

		var least = 0;

		while (least !== Infinity) {;

			distance[v] = Infinity;

			var edges = this.edges[v];
			for (var i = 0; i < edges.length; i++) {
				var edge = edges[i];
				if (edge.weight <= distance[edge.to] && distance[edge.to] !== Infinity) {
					distance[edge.to] = edge.weight;
					tree[edge.to] = {to: v, weight: edge.weight};
				}
			}

			var least = Math.min.apply(this, distance);
			v = distance.indexOf(least);
		}

		var newGraph = new WeightedGraph(this.vertexes);
		for (var i = 1; i < tree.length; i++) {
			if (tree[i]) newGraph.addEdge(i, tree[i].to, tree[i].weight);
		}
		return newGraph;
	}

	cut(threshold) {
		for (var i = 0; i < this.edges.length; i++) {
			var edgeList = this.edges[i];
			var trimmed = [];
			for (var j = 0; j < edgeList.length; j++) {
				var edge = edgeList[j];
				if (edge.weight < threshold) {
					trimmed.push(edge);
				}
			}
			this.edges[i] = trimmed;
		}
	}

	findComponents() {
		var component = 0;
		var assigned = [];
		for (var i = 0; i < this.vertexes.length; i++) {
			if (typeof assigned[i] == 'number') continue;
			assigned[i] = component++;
			this.breadthFirst(i, function(node, edges, index) {
				assigned[index] = component;
			});
		}
		this.componentMap = assigned;
		return assigned;
	}
}


export class Edge {
	constructor(from, to, weight) {
		this.from = from;
		this.to = to;
		this.weight = weight || 0;
	}
}

class Vertex {
	constructor(data) {
		this.data = data;
		this.edges = [];
	}

	static initializeSearch(a) {
		for (var i = 0; i < a.length; i++) a.status = Vertex.INITIALIZED;
	}

	static findComponents(a) {
		Vertex.initializeSearch(a);
		var component = 0;
		var sets = [];
		for (var i = 0; i < a.length; i++) {
			var node = a[i];
			if (node.status == Vertex.INITIALIZED) {
				var list = sets[component] = [];
				var add = function (data, edges, v) {
					v.component = component;
					list.push(v);
				};
				add(null, null, node);
				node.breadthFirst(add);
				component++;
			}
		}
		return sets;
	}
}

Vertex.INITIALIZED = 0;
Vertex.DISCOVERED = 1;
Vertex.PROCESSED = 2;
Vertex.prototype = {
	data: null,
	edges: null,
	component: null,
	status: 0,
	connect: function(endpoint, weight, directed) {
		directed = directed || false;
		weight = weight || 0;
		this.edges.push(new Edge(this, endpoint, weight));
		if (!directed) {
			endpoint.connect(this, weight, true);
		}
	},
	disconnect: function(endpoint) {
		var filtered = [];
		for (var i = 0; i < this.edges.length; i++) {
			var edge = this.edges[i];
			if (edge.to !== endpoing) {
				filtered.push(edge);
			}
		}
		this.edges = filtered;
	},
	breadthFirst: function(f) {
		var queue = [{to: this}];
		var edge;
		var visited = [];
		while (edge = queue.shift()) {
			var node = edge.to;
			if (visited.indexOf(node) == -1) {
				visited.push(node);
				queue = queue.concat(node.edges);
				var result = f(node.data, node.edges, node);
				node.status = result || Vertex.PROCESSED;
			}
		}
	},
	depthFirst: function(f) {
		var visited = [];
		var walker = function(node) {
			visited.push(node);
			var edges = node.edges.slice();
			f(node.data, node.edges, node);
			for (var i = 0; i < edges.length; i++) {
				var edge = edges[i];
				if (visited.indexOf(edge.to) == -1) {
					walker(edge.to);
				}
			}
		};
		walker(this);
	},
	findMST: function() {
		var sortByDistance = function(a, b) {
			return a.weight - b.weight;
		};
		var filterByTree = function(item) {
			return item.to.status == Vertex.INITIALIZED;
		}
		var tree = [];
		var v = this;
		var near = [];
		do {
			v.status = Vertex.PROCESSED;
			v.edges = v.edges.filter(filterByTree);
			near = near.filter(filterByTree).concat(v.edges).sort(sortByDistance);
			var next = near.shift();
			if (!next) break;
			tree.push({to: next.from, from: next.to, weight: next.weight});
			v = next.to;
		} while (near.length);

		this.breadthFirst(function(data, edges, vertex) {
			vertex.edges = [];
			var filtered = [];
			for (var i = 0; i < tree.length; i++) {
				var branch = tree[i];
				if (branch.to == vertex) {
					vertex.connect(branch.from, branch.weight, true);
				} else filtered.push(branch);
			}
			tree = filtered;
		});
		return this;
	}
}
