$(function() {
	g = new NetworkGraph(160);
	framework(g);
})

function sortPackage(a, b) {
	return a.createtime - b.createtime;
}

function framework(g) {
	var packages = random(5000);
	var p = new Array();
	for (var i = 1; i <= packages; i++) {
		var source, target, size, createtime;
		source = random(g.N);
		target = random(g.N);
		while (source == target) target = random(g.N);
		size = random(100, 2000000);
		createtime = random(1000000);
		p.push(new Package(source, target, g.fa[target][source], size, createtime));
	}
	p.sort(sortPackage);

}

function fatherPath(id, fa) {
	this.id = id;
	this.fa = fa;
}

function random(n, m = 0) {
	var ret;
	if (m == 0) {
		ret = Math.ceil(Math.random() * n);
		while (ret == 0) ret = Math.ceil(Math.random() * n);
		return ret;
	}
	else {
		ret = Math.floor(Math.random() * (m - n)) + n;
		return ret;
	}
}

function NetworkGraph(N) {
	this.N = N;
	this.adj;
	this.degree;
	this.fa;

	this.adj = new Array(N + 1);
	for (var i = 1; i <= N; i++) this.adj[i] = new Array();
	this.degree = new Array(N + 1);
	this.fa = new Array(N + 1);
	for (var i = 1; i <= N; i++) this.fa[i] = new Array();
	for (var i = 2; i <= N; i++) {
		var j = random(i);
		while (this.degree[j] > 4) j = random(i);
		this.degree[i]++;
		this.degree[j]++;
		this.adj[i].push(j);
		this.adj[j].push(i);
	}
	var vst = new Array();
	for (var i = 1; i <= N; i++) vst[i] = 0;
	for (var i = 1; i <= N; i++) {
		for (var j = 0; j < adj[i].length; j++) {
			adj[i][j] = 1;
		}
		for (var k = this.degree[i]; k <= 4; k++) {
			var j = random(N + 1);
			while (i == j || vst[j] || this.degree[j] > 4) j = random(N + 1);
			this.degree[i]++;
			this.degree[j]++;
			this.adj[i].push(j);
			this.adj[j].push(i);
		}
		for (var x = in this.adj[i]) {
			vst[x] = 0;
		}
	}
	for (var i = 1; i <= N; i++) {
		this.bfs(i);
	}
}

NetworkGraph.prototype = {
	constructor : NetworkGraph,
	bfs : function(u) {
		var l = 0, r = 0;
		var q = new Array(N << 1);
		var d = new Array(N + 1);
		q[++r] = u;
		d[u] = 1;
		this.fa[u][u] = new fatherPath(u, null);
		while (l < r) {
			var x = q[++l];
			for (var j = 0; j < this.adj[x].length; j++) {
				var y = this.adj[x][j];
				if (!d[y]) {
					d[y] = d[x] + 1;
					this.fa[u][y] = new fatherPath(y, this.fa[u][y]);
				}
			}
		}
	}
}

function Queue() {
	this.queue = new Array();
}

Queue.prototype = {
	constructor: Queue,
	push : function(u) {
		this.queue.push(u);
	},
	poll : function() {
		return this.queue.shift();
	},
	empty : function() {
		return this.queue.length == 0;
	}
}

function Heap() {
	this.heap = new Array();
}

Heap.prototype = {
	constructor : Heap,
	add : function(u) {
		this.heap.push(u);
	},
	heapup : function(u) {
		while (u > 1) {
			if (this.heap[u].second < this.heap[u >> 1].second) {
				var temp = this.heap[u];
				this.heap[u] = this.heap[u >> 1];
				this.heap[u >> 1] = temp;
			}
			else break;
		}
	},
	heapdown : function(u) {
		var len = this.heap.length;
		while (2 * u <= len) {
			var j = 2 * u;
			if (2 * u < len && this.heap[u << 1 | 1].second < this.heap[j].second) j++;
			if (this.heap[j].second < this.heap[u].second) {
				var temp = this.heap[u];
				this.heap[u] = this.heap[j];
				this.heap[j] = temp;
				u = j;
			}
			else break;
		}
	},
	top : function() {
		if (this.heap.length == 0) return null;
		return this.heap[1];
	},
	pop : function() {
		this.heap[1] = this.heap.pop();
		heapdown(1);
	},
	update : function() {
		for (var i = 1; i <= this.heap.length; i++) {
			this.heap[i].second -= 1000000;
		}
	}
}

function Pair(first, second) {
	this.first = first;
	this.second = second;
}

function make_pair(first, second) {
	return new Pair(first, second);
}

function Package(source, target, fa, size, createtime, customer = 0) {
	this.source = source;
	this.target = target;
	this.fa = fa;
	this.size = size;
	this.createtime = createtime;
	this.costomer = customer;
	this.consume = 0;
}