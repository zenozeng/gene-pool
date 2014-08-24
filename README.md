# gene-pool

Genetic algorithms in a given gene pool

## Usage

```javascript
// 初始化
var population = new GenePool(opts);
// 繁衍三代
population.next();
population.next();
population.next();
```

```javascript
// 初始化
var population = new GenePool(opts);
// 在大约两秒时间内尽可能繁衍迭代
population.timeout(2000, function(err, results) {
    console.log(results);
});
```

### Opts

- N: 个体基因数
- K: 种群规模（种群稳定时的数量）
- genes: 基因
- weights: 基因权重，影响出现的可能性大小（可选）
- mutationRate: 基因突变率，大约有多少比例的基因需要突变
- birthRate: 出生率

## Demo

Demo 是一个以五色总亮度作为 fitness 的一个测试。
黑框表示是突变出来的基因。

```javascript
opts.K = 5;
opts.N = 5;
opts.mutationRate = 0.1;
opts.birthRate = 1;
```

http://zenozeng.github.io/gene-pool/demo/

## Why

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

- 为保证最终产生数目竟可能 >= K，这个库的做法是先出生再定向选择，而往常的做法可能是用存活率的概念，然后再补满。

## License

The MIT License (MIT)

Copyright (c) 2014 Zeno Zeng

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

