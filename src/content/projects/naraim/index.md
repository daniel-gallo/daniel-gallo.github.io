---
title: '📄 NeurIPS - NARAIM: Native Aspect Ratio Autoregressive Image Models'
description: "We extend autoregressive image model pre-training to native aspect ratios"
date: "October 13 2024"
arxivURL: "https://arxiv.org/abs/2410.10012"
openReviewURL: "https://openreview.net/forum?id=7Iuh8VWU66"
repoURL: "https://github.com/daniel-gallo/naraim"
---

While vision transformers are able to solve a wide variety of computer vision tasks, no pre-training method has yet demonstrated the same scaling laws as observed in language models. Autoregressive models show promising results, but are commonly trained on images that are cropped or transformed into square images, which distorts or destroys information present in the input. To overcome this limitation, we propose NARAIM, a vision model pre-trained with an autoregressive objective that uses images in their native aspect ratio. By maintaining the native aspect ratio, we preserve the original spatial context, thereby enhancing the model's ability to interpret visual information. In our experiments, we show that maintaining the aspect ratio improves performance on a downstream classification task.
