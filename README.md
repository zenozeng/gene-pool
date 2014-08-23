gene-pool
=========

Genetic algorithms in a given gene pool

## 一些假设前提

只是为了计算，而非生物学正确。

- 一个个体必须含有N个基因库中的不相重复的基因

- 随机变异只发生在给定基因库

- 交叉互换只发生在当前种群存活个体

- 基因相同但基因顺序不同的个体视为相同

- 基因必须是简单类型：string / number 之类，可以 indexOf 去判断的。
