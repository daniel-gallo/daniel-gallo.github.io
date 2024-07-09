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