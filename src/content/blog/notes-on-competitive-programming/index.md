---
title: "Notes on Competitive Programming"
description: "Mostly taken from Antti Laaksonen's book"
date: "07/09/2024"
draft: false
---
# Debugging
<details>
<summary>Print vectors and matrices</summary>

```cpp
template <class T> ostream &operator<<(ostream &out, vector<T> &v) {
    for (auto &element : v) {
        out << element << '\t';
    }

    return out;
}

template <class T> ostream &operator<<(ostream &out, vector<vector<T>> &matrix) {
    for (auto &row : matrix) {
        out << row << endl;
    }

    return out;
}
```

</details>

# IO

```cpp
cin.tie(nullptr);
ios_base::sync_with_stdio(false);
```

<details>

<summary>Read numbers faster</summary>

```cpp
#include <cstdio>

template <class T> inline T read_number() {
    char c = 0;
    T x = 0;

    // Ignore chars that are not numbers
    while (c < '0' || c > '9') {
        c = getchar_unlocked();
    }

    // Read number
    do {
        x = x * 10 + (c - '0');
        c = getchar_unlocked();
    } while (c >= '0' && c <= '9');

    return x;
}
```

</details>

# Binary search
- `bisect_left(l, target)`: if target exists, it will output the index of the first occurrence. Otherwise, it will output the index where it should be inserted to keep the order.
- `bisect_right(l, target)`: if target exists, it will output the index **after** the last occurrence. Otherwise it will output the index where it should be inserted to keep the order. 
- Both methods return the same number if and only if target does not exist.

<details>
<summary>Binary search implementation</summary>

```python
def bisect_left(l, target):
    lo = 0
    hi = len(l)

    while lo < hi:
        mid = (lo + hi) // 2

        if l[mid] < target:
            lo = mid + 1
        else:
            hi = mid
    
    return lo

def bisect_right(l, target):
    lo = 0
    hi = len(l)

    while lo < hi:
        mid = (lo + hi) // 2

        if l[mid] <= target:
            lo = mid + 1
        else:
            hi = mid

    return lo
```

</details>

# Graph stuff

## Dijkstra
Gets all distances from a given node in $O(n + m\log(m))$.

<details>

<summary>Dijkstra implementation</summary>

```cpp
// Input:
//  - adj: adj[src] = (dst, length), where everything is 0-indexed
//  - start
// Output:
//  - d: d[dst] = min distance from start to dst
vector<long long> dijkstra(const vector<vector<pair<int, long long>>> &adj, int start) {
    int n = adj.size();

    vector<long long> d(n, numeric_limits<long long>::max());
    d[start] = 0;

    vector<bool> is_closed(n, false);

    priority_queue<pair<long long, int>> q;
    q.push({0, start});

    while (!q.empty()) {
        auto [_, src] = q.top();
        q.pop();

        if (is_closed[src]) {
            continue;
        }
        is_closed[src] = true;

        for (auto [dst, length] : adj[src]) {
            if (d[src] + length < d[dst]) {
                d[dst] = d[src] + length;
                q.push({-d[dst], dst});
            }
        }
    }

    return d;
}
```

</details>

## Floyd-Warshall

Gets all pair-wise distances in $O(n^3)$.

<details>

<summary>Floyd-Warshall implementation</summary>

```cpp
constexpr long long inf = 1e18;

// Input:
//  - adj: adj[src] = (dst, length), where everything is 0-indexed
// Output:
//  - n x n matrix with all pairwise distances
vector<vector<long long>> floyd_warshall(const vector<vector<pair<int, long long>>> &adj) {
    int n = adj.size();
    vector<vector<long long>> d(n, vector<long long>(n, inf));
    for (int i = 0; i < n; ++i) {
        d[i][i] = 0;
    }
    for (int src = 0; src < n; ++src) {
        for (auto [dst, length] : adj[src]) {
            d[src][dst] = min(d[src][dst], length);
        }
    }

    for (int k = 0; k < n; ++k) {
        for (int src = 0; src < n; ++src) {
            for (int dst = 0; dst < n; ++dst) {
                d[src][dst] = min(d[src][dst], d[src][k] + d[k][dst]);
            }
        }
    }

    return d;
}
```
</details>

## Max-Flow / Min-Cut
The Ford-Fulkerson algorithm works as follows. At first, we will add reverse edges with zero capacity. This ensures that we can ``backtrack'' if we made a mistake choosing a earlier path. Then, we will repeat these two steps until we can no longer do Step 1.
1. Find a path from the source to the sink. We will be able to push as much ``water'' as the smallest capacity in the path.
2. Subtract the new flow from the original path, and add it to the reverse path. 

How we find a path in Step 1 is up to us. If we do BFS, the algorithm runs in $O(nm^2)$ and is called Edmonds-Karp.

<details>

<summary>Edmonds-Karp implementation</summary>

```cpp
constexpr long long inf = numeric_limits<long long>::max();

// adjacency list of the undirected graph
vector<vector<int>> adj;
// matrix for every pair of nodes
// initially, capacities[src][dst] = weight
vector<vector<long long>> capacities;
int n;

long long bfs(int source, int sink, vector<int> &parents) {
    parents.assign(n, -1);
    parents[source] = -2;
    // (node, flow until that point)
    queue<pair<int, long long>> q;
    q.push({source, inf});

    while (!q.empty()) {
        auto [current_node, current_flow] = q.front();
        q.pop();

        for (int next_node : adj[current_node]) {
            bool is_not_visited = parents[next_node] == -1;
            bool is_reachable = capacities[current_node][next_node] > 0;
            if (is_not_visited && is_reachable) {
                parents[next_node] = current_node;
                long long new_flow = min(current_flow, capacities[current_node][next_node]);
                if (next_node == sink) {
                    return new_flow;
                }
                q.push({next_node, new_flow});
            }
        }
    }

    return 0;
}

long long max_flow(int source, int sink) {
    // Ford-Fulkerson algorithm with BFS (Edmonds-Karp)
    long long flow = 0;
    vector<int> parents(n);
    long long new_flow = 0;

    while ((new_flow = bfs(source, sink, parents)) > 0) {
        flow += new_flow;
        int current_node = sink;
        while (current_node != source) {
            int previous_node = parents[current_node];
            capacities[previous_node][current_node] -= new_flow;
            capacities[current_node][previous_node] += new_flow;
            current_node = previous_node;
        }
    }

    return flow;
}
```

</details>

## Kosaraju's algorithm

Finds the strongly connected components (SCC) of a directed graph in $O(n + m)$. It runs DFS twice, the first one on the original graph, and the second one on the transpose graph (the one in which all edges are reversed). Some observations:

- We will be able to traverse all nodes in a SCC in both the original and the transpose graph. In the first DFS pass, we might jump from one SCC to another. In the second one, this is not possible, as we will see shortly.
- Let's imagine $u_1$ lives in $SCC_1$ and that $u_2$ lives in $SCC_2$ and that $SCC_1 \leadsto SCC_2$. Then $u_1$ will be ``closed'' after $u_2$. This is easy to see applying the "Parenthesis theorem" (the exploring intervals are either nested or disjoint).
- Thus, in the second DFS, we want to start exploring nodes in $SCC_1$ first (as we will not be able to jump to $SCC_2$ in the transpose graph).

<details>

<summary>Kosaraju's algorithm implementation</summary>

```cpp
void dfs(int node, const vector<vector<int>> &adj, vector<bool> &visited, vector<int> &output) {
    visited[node] = true;

    for (int neighbor : adj[node]) {
        if (visited[neighbor]) {
            continue;
        }

        dfs(neighbor, adj, visited, output);
    }

    output.push_back(node);
}

vector<int> get_scc(const vector<vector<int>> &adj) {
    // Kosaraju's algorithm
    int n = adj.size();

    // First DFS pass
    vector<bool> visited(n, false);
    vector<int> nodes_by_exit_time;
    for (int node = 0; node < n; ++node) {
        if (visited[node]) {
            continue;
        }

        dfs(node, adj, visited, nodes_by_exit_time);
    }
    reverse(nodes_by_exit_time.begin(), nodes_by_exit_time.end());

    // Construct transpose graph
    vector<vector<int>> rev_adj(n);
    for (int src = 0; src < n; ++src) {
        for (int dst : adj[src]) {
            rev_adj[dst].push_back(src);
        }
    }

    // Second DFS pass on the transpose graph
    visited.assign(n, false);
    vector<int> scc_by_node(n, -1);
    int scc_id = 0;
    for (int node : nodes_by_exit_time) {
        if (visited[node]) {
            continue;
        }

        vector<int> nodes_in_scc;
        dfs(node, rev_adj, visited, nodes_in_scc);
        for (int node_in_scc : nodes_in_scc) {
            scc_by_node[node_in_scc] = scc_id;
        }
        scc_id++;
    }

    return scc_by_node;
}

```

</details>

## Kruskal
It finds a minimum spanning tree by adding edges in order as long as they don't create cycles. A fast implementation will use a data structure that allows merging sets quickly (Disjoint Set Union / Union-Find / Merge-Find).

<details>

<summary>Kruskal implementation</summary>

```cpp
struct Edge {
    int src;
    int dst;
    int weight;

    bool operator<(const Edge &other) const { return weight < other.weight; }
};

struct DSU {
    vector<int> parents;

    DSU(int n) {
        parents.assign(n, 0);
        for (int i = 0; i < n; ++i) {
            parents[i] = i;
        }
    }

    int find(int v) {
        if (v == parents[v]) {
            return v;
        }

        int representative = find(parents[v]);
        // path-compression optimization
        parents[v] = representative;
        return representative;
    }

    void merge(int u, int v) {
        u = find(u);
        v = find(v);

        if (u != v) {
            parents[v] = u;
        }
    }
};

// Input:
//   - n: the number of nodes in the graph
//   - edges: a list of (src, dst, weight)
// Output:
//   - cost of the MST or -1 if the graph is not connected
long long kruskal(int n, vector<Edge> &edges) {
    sort(edges.begin(), edges.end());

    DSU dsu = DSU(n);
    long long cost = 0;
    for (auto [src, dst, weight] : edges) {
        int u = dsu.find(src);
        int v = dsu.find(dst);

        if (u != v) {
            cost += weight;
            dsu.merge(u, v);
        }
    }

    // check if all nodes are connected
    int representative = dsu.find(0);
    for (int i = 1; i < n; ++i) {
        if (dsu.find(i) != representative) {
            return -1;
        }
    }

    return cost;
}

```

</details>

# Strings

## O(1) hash queries
By preprocessing a string `s` in $O(n)$ we can compute the hash of `s[a...b]` for any `a` and `b` in $O(1)$.

<details>

<summary>Show StringHasher implementation</summary>

```cpp
struct StringHasher {
    const long long A = 911382323;
    const long long B = 972663749;

    vector<long long> prefix_hash;
    vector<long long> coefficients;
    int n;

    StringHasher(string s) {
        n = s.size();

        prefix_hash.assign(n, 0);
        prefix_hash[0] = s[0];
        for (int i = 1; i < n; ++i) {
            prefix_hash[i] = (A * prefix_hash[i - 1] + s[i]) % B;
        }

        coefficients.assign(n, 0);
        coefficients[0] = 1;
        for (int i = 1; i < n; ++i) {
            coefficients[i] = (A * coefficients[i - 1]) % B;
        }
    }

    // Computes hash(s[a...b]) (both endpoints included)
    long long hash(int a, int b) {
        if (a == 0) {
            return prefix_hash[b];
        }

        long long result = (prefix_hash[b] - prefix_hash[a - 1] * coefficients[b - a + 1]) % B;
        if (result < 0) {
            result += B;
        }

        return result;
    }
};
```

</details>

# Range queries

| Name                          | Operations  | Initialization | Update       | Access       |
| :---------------------------- | :---------- | :------------- | :----------- | :----------- |
| Prefix sum                    | Sum         | $O(n)$         | -            | $O(1)$       |
| Sparse table                  | Max/Min     | $O(n\log{n})$  | -            | $O(1)$       |
| Fenwick (binary indexed) tree | Sum         | $O(n)$         | $O(\log{n})$ | $O(\log{n})$ |
| Segment tree                  | Sum/Max/Min | $O(n\log{n})$  | $O(\log{n})$ | $O(\log{n})$ |

<details>

<summary>Fenwick tree implementation</summary>

```cpp
template <class T> struct FenwickTree {
    vector<T> tree;
    int n;

    // v is assumed to be 1-indexed: [0, element_1, element_2, ....]
    FenwickTree(vector<T> &v) {
        n = v.size() - 1;

        // This is faster than calling .update() n times
        // O(nlogn) -> O(n)
        tree.assign(v.begin(), v.end());
        for (int i = 1; i <= n; ++i) {
            int p = i + (i & -i);
            if (p <= n) {
                tree[p] += tree[i];
            }
        }
    }

    // Sums from 1 to i (both inclusive and 1-indexed)
    T query(int i) {
        T total = 0;

        while (i > 0) {
            total += tree[i];
            i -= i & -i;
        }

        return total;
    }

    // Updates the tree by adding difference to the i-th element
    // (1-indexed)
    void update(int i, T difference) {
        while (i <= n) {
            tree[i] += difference;
            i += i & -i;
        }
    }
};
```

</details>

<details>

<summary>Segment tree implementation</summary>

```cpp
template <class T> struct SegmentTree {
    // min, max, sum...
    function<T(T, T)> op;
    // min -> INT_MAX, max -> INT_MIN, sum -> 0...
    T identity;

    vector<T> tree;
    int n;

    // v is assumed to be 0-indexed: [element_0, element_1, ...]
    SegmentTree(vector<T> &v, function<T(T, T)> op_, T identity_) : op(op_), identity(identity_) {
        n = v.size();

        // The first element of tree will never be accessed
        tree.assign(2 * n, 0);
        for (int i = 0; i < n; ++i) {
            update(i, v[i]);
        }
    }

    // Both start and end are inclusive and 0-indexed
    T query(int start, int end) {
        start += n;
        end += n;

        T total = identity;
        while (start <= end) {
            if (start % 2 == 1) {
                total = op(total, tree[start++]);
            }
            if (end % 2 == 0) {
                total = op(total, tree[end--]);
            }

            start /= 2;
            end /= 2;
        }

        return total;
    }

    // i is 0-indexed
    void update(int i, T value) {
        int parent = i + n;
        tree[parent] = value;

        while (parent > 1) {
            parent = parent / 2;
            int child_1 = parent * 2;
            int child_2 = parent * 2 + 1;

            tree[parent] = op(tree[child_1], tree[child_2]);
        }
    }
};
```

</details>

## g++ ordered_set

If we use a set and we want to get the index of an element, we can use `distance(s.begin(), s.find(e))`, but this is $O(n)$. We can use the g++ implementation, that includes two handy functions that are $O(\log n)$:
- `order_of_key(k)`: number of items strictly smaller than k
- `find_by_order(k)`: k-th element in the sorted collection (0-indexed)

<details>

<summary>Show g++ tree</summary>

```cpp
#include <ext/pb_ds/assoc_container.hpp>
#include <ext/pb_ds/tree_policy.hpp>

using namespace __gnu_pbds;

// key type -> int
// value type -> null_type (so we get a set)
#define ordered_set tree<int, null_type, less<int>, rb_tree_tag, tree_order_statistics_node_update>
```

</details>

# Math
## Matrix binary exponentiation
This is useful to compute linear recursions in logarithmic time. For example, the Fibonacci numbers can be defined as follows:

$$
\begin{bmatrix}
    F_n \\
    F_{n + 1}
\end{bmatrix}
= 
\begin{bmatrix}
    0 & 1 \\
    1 & 1
\end{bmatrix}
\begin{bmatrix}
    F_{n - 1} \\
    F_{n} \\
\end{bmatrix}
$$

We see that

$$
\begin{bmatrix}
    F_n \\
    F_{n + 1}
\end{bmatrix}
= 
\begin{bmatrix}
    0 & 1 \\
    1 & 1
\end{bmatrix}^n
\begin{bmatrix}
    0 \\
    1 \\
\end{bmatrix}
$$

We can compute powers in logarithmic time by using binary exponentiation. For example, $5^{13} = 5^{1101_2} = 5^8 \cdot 5^4 \cdot 5^1$ (note that we don't need to perform 13 multiplications, we just need to compute $5^1, 5^2, 5^4$ and $5^8$).

<details>

<summary>See implementation</summary>

```cpp
class Matrix {
  public:
    int n;
    vector<vector<ll>> m;

    Matrix(vector<vector<ll>> &m) : n(m.size()), m(m) {}

    Matrix(int n) : n(n) {
        m.assign(n, vector<ll>(n, 0));

        for (int i = 0; i < n; ++i) {
            m[i][i] = 1;
        }
    }

    Matrix operator*(const Matrix &other) const {
        vector<vector<ll>> new_m(n, vector<ll>(n, 0));

        for (int i = 0; i < n; ++i) {
            for (int k = 0; k < n; ++k) {
                for (int j = 0; j < n; ++j) {
                    new_m[i][j] = (new_m[i][j] + m[i][k] * other.m[k][j]) % mod;
                }
            }
        }

        return Matrix(new_m);
    }

    vector<ll> operator*(const vector<ll> &v) const {
        vector<ll> new_v(n);

        for (int i = 0; i < n; ++i) {
            for (int k = 0; k < n; ++k) {
                new_v[i] = (new_v[i] + m[i][k] * v[k]) % mod;
            }
        }

        return new_v;
    }

    Matrix operator^(long long power) const {
        Matrix result(n);
        Matrix base = *this;

        while (power > 0) {
            if (power % 2 == 1) {
                result = result * base;
            }
            base = base * base;
            power /= 2;
        }

        return result;
    }
};
```

</details>