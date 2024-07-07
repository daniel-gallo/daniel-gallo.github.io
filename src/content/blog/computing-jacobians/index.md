---
title: "Computing Jacobians"
description: "Index notation vs total derivative definition"
date: "06/07/2024"
draft: false
---
When computing Jacobians by hand, it is common to use the so-called ``index notation''. However, directly using the definition of total derivative can be faster. 

# What is the Jacobian?

Let $f \colon \R^n \to \R^m$ be an arbitrary function
$$
f(\bm{x}) = 
\begin{bmatrix}
    f_1(\bm{x}) \\
    \vdots \\
    f_m(\bm{x})
\end{bmatrix},
$$
where $f_i \colon \R^n \to \R$. We define its Jacobian matrix at a point as follows:
$$
J = 
\begin{bmatrix}
    \rule[0.5ex]{5mm}{0.1pt} & \nabla f_1 & \rule[0.5ex]{5mm}{0.1pt} \\
    & \vdots & \\
    \rule[0.5ex]{5mm}{0.1pt} & \nabla f_m & \rule[0.5ex]{5mm}{0.1pt} \\
\end{bmatrix} = 
\begin{bmatrix}
    \frac{\partial f_1}{\partial x_1} & \dots & \frac{\partial f_1}{\partial x_n} \\
    & \vdots & \\
    \frac{\partial f_m}{\partial x_1} & \dots & \frac{\partial f_m}{\partial x_n} \\
\end{bmatrix} \in \R^{m \times n}.
$$

# Computing the Jacobian using index notation

**Example 1**

Let us calculate the Jacobian of $f \colon \R^n \to \R^m$ given by  $f(\bm{x}) = A\bm{x}$. Note that $f$ can be expressed as
$$
f(\bm{x}) = 
\begin{bmatrix}
    A_{11} & \dots & A_{1n} \\
    & \vdots & \\
    A_{m1} & \dots & A_{mn} \\
\end{bmatrix}
\begin{bmatrix}
    x_1 \\
    \vdots \\
    x_n
\end{bmatrix}.
$$
Thus, $f_i(\bm{x}) = \sum_{k = 1}^n A_{ik}x_k$. Taking the derivative with respect to $x_j$ we obtain that $\frac{\partial f_i}{\partial x_j} = A_{ij}$. Thus, the Jacobian is given by $J = A$.


**Example 2**

Let us now compute the Jacobian of $f \colon \R^n \to \R$ given by $f(\bm{x}) = \bm{x}^T A \bm{x}$. First we will need to do some gymnastics to get a closed form for $f$:
$$
\begin{align*}
    f(\bm{x}) &= 
        \begin{bmatrix}
            x_1 & \dots & x_n
        \end{bmatrix}
        \begin{bmatrix}
            A_{11} & \dots & A_{1n} \\
            & \vdots & \\
            A_{n1} & \dots & A_{nn} \\
        \end{bmatrix}
        \begin{bmatrix}
            x_1 \\
            \vdots \\
            x_n
        \end{bmatrix} \\
    &= 
        \begin{bmatrix}
            x_1 & \dots & x_n
        \end{bmatrix}
        \begin{bmatrix}
            \sum_{k = 1}^n A_{1k} x_k \\
            \vdots \\
            \sum_{k = 1}^n A_{nk} x_k
        \end{bmatrix} \\
    &= \sum_{l, k = 1}^n A_{lk} x_l x_k

\end{align*}
$$

Let us take the derivative with respect to $x_j$:
$$
\begin{align*}
    \frac{\partial f}{\partial x_j} &= \sum_{k \neq j}^n A_{kj} x_k + \sum_{k \neq j}^n A_{jk} x_k + 2A_{jj} x_j \\
    &= \sum_{k = 1}^n (A_{kj} + A_{jk}) x_k
\end{align*}
$$
As we can (not very easily) see, the Jacobian is given by $\bm{x}^T (A + A^T)$.


# Computing the Jacobian using the definition of total derivative
The total derivative of $f$ at a point is the best linear approximation of the function near that point. If $f$ is differentiable, the total derivative will be equal to the Jacobian.
$$
f(\bm{x} + \bm{h}) = f(\bm{x}) + J(\bm{x}) \bm{h} + o(\lVert h \rVert)
$$

Thus, we can compute the Jacobian by expressing $f(\bm{x} + \bm{h}) - f(\bm{x})$ as $J(\bm{x}) \bm{h} + o(\lVert \bm{h} \rVert)$. As we will see, this is sometimes significantly faster than using index notation. 

**Example 1 revisited**

For $f(\bm{x}) = A\bm{x}$, we compute 
$$
f(\bm{x} + \bm{h}) - f(\bm{x}) = A(\bm{x} + \bm{h}) - A\bm{x} = A\bm{h}.
$$
Thus, the Jacobian is $A$. 

**Example 2 revisited**
For 
$f(\bm{x}) = \bm{x}^T A \bm{x}$, we can compute
$$
\begin{align*}
    f(\bm{x} + \bm{h}) - f(\bm{x}) &= (\bm{x} + \bm{h})^T A (\bm{x} + \bm{h})  - \bm{x}^T A \bm{x} \\
    &= \bm{x}^T A \bm{h} + \bm{h}^T A \bm{x} + \bm{h}^T A \bm{h} \\
    &= \bm{x}^T (A + A^T) \bm{h} + o(\lVert \bm{h} \rVert)
\end{align*}
$$
We can immediately see that the Jacobian is $\bm{x}^T (A + A^T)$.