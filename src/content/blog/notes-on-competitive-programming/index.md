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