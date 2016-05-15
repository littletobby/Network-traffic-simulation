$(function() {
	var N = 160;
	var g = new NetworkGraph(N);
	//return;
	var h = new Heap();
	var q = new Array(N + 1);
	for (var i = 1; i <= N; i++)
		q[i] = new Queue();
	var now = 0;
	
	
	var tick = function() {
		//console.log(Date.now());
		now++; 
		var server = new Array(N + 1);
		var edge = {};
		for (var i = 1; i <= N; i++)
			server[i] = 0;
		framework(g, h, q, now, server, edge);
		if (now <= 5)
		setTimeout(tick, 1000);
	}
	tick();
})

function sortPackage(a, b) {
	return a.createtime - b.createtime;
}

var total = 0, totaltime = 0, remain = 0;

function framework(g, h, q, now, server, edge) {
	var packages = random(5000);
	packages = 50;
	//if (now > 1) packages = 0;
	var bandwith = 1;
	var p = new Array();
	for (var i = 1; i <= packages; i++) {
		var source, target, size, createtime;
		source = random(g.N);
		target = random(g.N);
		while (source == target) target = random(g.N);
		size = random(100, 200000) / 1000000.0;
		//size += 0.5;
		createtime = Math.random() + now;
		createtime = now;
		p.push(new Package(source, target, g.fa[target][source], size, createtime, createtime));
	}
	p.sort(sortPackage);
	//h.update();
	for (var i = 0; i < packages; i++) {
		p[i].liningup = now;
		if (q[p[i].source].empty) h.add(make_pair(p[i].source, p[i].createtime));
		q[p[i].source].push(p[i]);
	}
	//console.log(packages);
	//if (packages) {
	//	console.log(p[0]);
	//	g.printpath(p[0].source, p[0].target);
	//}
	//return;
	console.log('now: ' + now);
	var usage = new Array(g.N + 1);
	for (var i = 1; i <= g.N; i++) usage[i] = new Array();
	while (!h.empty()) {
		var x = h.top();
		//console.log('server: ' + x.first + ' ' + x.second);
		//var t = h.size();
		//console.log('size: ' + t);
		if (x.second >= now + 1) break;
		var u = q[x.first].front();
		var rt = u.remainsize / bandwith;
		//console.log(rt + ' ' + x.second);
		//console.log(u);
		if (rt + x.second >= now + 1) {
			var temp = (now + 1 - x.second) * bandwith;
			//if (temp < 0) console.log('temp < 0: ' + temp);
			//var rs = u.remainsize;
			u.remainsize -= temp;
			server[x.first] += temp;
			usage[x.first].push(make_pair(x.second, now + 1));
			if (temp > 0.2) console.log('temp > 0.2');
			//if (u.remainsize < 0) console.log('u.remainsize < 0: ' + u.size + ' ' + rs + ' ' + rt + ' ' + (rt + x.second) + ' ' + (now + 1));
			x.second = now + 1;
			h.heapdown(1);
		}
		else {
			h.pop();
			q[x.first].poll();
			//if (u.remainsize < 0) console.log('remainsize < 0: ' + u.remainsize);
			if (u.remainsize > 0.2) console.log('remainsize > 0.2');
			server[x.first] += u.remainsize;
			usage[x.first].push(make_pair(x.second, x.second + rt));
			//console.log(u.fa.fa.id);
			var to = u.fa.fa.id;
			//console.log('recive server: ' + to);
			if (!q[x.first].empty) {
				h.add(make_pair(x.first, x.second + rt));
			}
			if (to == u.target) {
				u.arrivetime = x.second + rt;
				//console.log(u.source + ' ' + u.target + ': ' + (u.arrivetime - u.createtime));
				total++;
				totaltime += u.arrivetime - u.createtime;
				//console.log(u.createtime + ' ' + u.arrivetime);
			}
			else {
				//console.log(u.remainsize);
				//u.remainsize = u.size;
				//u.liningup = now + x.second + rt;
				//u.fa = u.fa.fa;
				//var temp = u.fa.fa;
				//u.fa = temp;
				//console.log(temp);
				var liningup = x.second + rt;
				if (q[to].empty) h.add(make_pair(to, liningup));
				q[to].push(new Package(u.source, u.target, u.fa.fa, u.size, u.createtime, liningup));
				//console.log('top: ' + h.top().first);
				//console.log('size: ' + h.size);
			}
		}
	}
	remain = 0;
	for (var i = 1; i <= g.N; i++)
		remain += q[i].size();
	console.log(total + ' ' + totaltime + ' ' + (totaltime / total) + ' ' + remain);
	console.log(server);
	console.log(usage);
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
	for (var i = 1; i <= N; i++) this.fa[i] = new Array(N + 1);
	for (var i = 2; i <= N; i++) {
		var j = random(i - 1);
		while (this.degree[j] > 4) j = random(i - 1);
		this.degree[i]++;
		this.degree[j]++;
		this.adj[i].push(j);
		this.adj[j].push(i);
	}
	var vst = new Array();
	for (var i = 1; i <= N; i++) vst[i] = 0;
	for (var i = 1; i <= N; i++) {
		for (var j = 0; j < this.adj[i].length; j++) {
			var y = this.adj[i][j];
			vst[y] = 1;
		}
		for (var k = this.degree[i]; k <= 4; k++) {
			var j = random(N + 1);
			while (i == j || vst[j] || this.degree[j] > 4) j = random(N);
			vst[j] = 1;
			this.degree[i]++;
			this.degree[j]++;
			this.adj[i].push(j);
			this.adj[j].push(i);
		}
		for (var j = 0; j < this.adj[i].length; j++) {
			var y = this.adj[i][j];
			vst[y] = 0;
		}
	}
	for (var i = 1; i <= N; i++) {
		for (var j = 0; j < this.adj[i].length; j++) {
			var y = this.adj[i][j];
			//console.log(i + ' ' + y);
		}
	}
	//this.bfs(1);
	//return;
	for (var i = 1; i <= N; i++) {
		this.bfs(i);
	}
}

NetworkGraph.prototype = {
	constructor : NetworkGraph,
	bfs : function(u) {
		var l = 0, r = 0;
		var q = new Array(this.N << 1);
		var d = new Array(this.N + 1);
		q[++r] = u;
		d[u] = 1;
		this.fa[u][u] = new fatherPath(u, null);
		while (l < r) {
			var x = q[++l];
			for (var j = 0; j < this.adj[x].length; j++) {
				var y = this.adj[x][j];
				if (!d[y]) {
					d[y] = d[x] + 1;
					this.fa[u][y] = new fatherPath(y, this.fa[u][x]);
					q[++r] = y;
				}
			}
		}
		//console.log(l);
	},
	printpath : function(u, v) {
		var t = this.fa[v][u];
		while (t.id != v) {
			console.log(t.id);
			t = t.fa;
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
	front : function() {
		if (this.queue.length == 0) return null;
		return this.queue[0];
	},
	size : function() {
		return this.queue.length;
	},
	empty : function() {
		return this.queue.length == 0;
	}
}

function Heap(n) {
	this.heap = new Array(n);
	this.length = 0;
}

Heap.prototype = {
	constructor : Heap,
	add : function(u) {
		this.heap[++this.length] = u;
		this.heapup(this.length);
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
		while (2 * u <= this.length) {
			var j = u << 1;
			if (2 * u < this.length && this.heap[j | 1].second < this.heap[j].second) j++;
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
		if (this.length == 0) return null;
		return this.heap[1];
	},
	pop : function() {
		if (this.length) {
			var ret = this.heap[1];
			this.heap[1] = this.heap[this.length];
			this.length--;
			this.heapdown(1);
			return ret;
		}
		return null;
	},
	size : function() {
		return this.length;
	},
	empty : function() {
		return this.length == 0;
	},
	update : function() {
		for (var i = 1; i <= this.length; i++) {
			this.heap[i].second -= 1;
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

function Package(source, target, fa, size, createtime, liningup, customer = 0) {
	this.source = source;
	this.target = target;
	this.fa = fa;
	this.size = size;
	this.remainsize = size;
	this.createtime = createtime;
	this.costomer = customer;
	this.arrivetime;
	this.liningup;
}