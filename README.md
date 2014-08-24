# gene-pool

Genetic algorithms in a given gene pool

有时候，我们需要在一个不小的数据集中取一个不大组合。
但由于组合的关系，需要的计算量可能不小，
比如从 length 为 40 里的 array 随意取 5 个元素来组合。
那么就有 658008 种可能性，
而我们要的只是比如里面 TOP 100。
显然完全计算fitness然后sort是非常有压力了，那么就用遗传算法。

## 一些假设前提

只是为了计算，而非生物学正确。

- 一个个体必须含有N个基因库中的不相重复的基因

- 随机变异只发生在给定基因库

- 产生子代时，从亲代整个群体随机获取基因

- 基因相同但基因顺序不同的个体视为相同

- 请保证基因库充足，否则可能陷入死循环 [TODO: fix this]

## Demo

Demo 是一个以亮度作为 fitness 的一个测试。

http://zenozeng.github.io/gene-pool/demo/
