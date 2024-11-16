---
title: '📄 TMLR - Reproducibility Study of "ITI-GEN: Inclusive Text-to-Image Generation"'
description: "ITI-GEN works and can be combined with HPS with negative prompting"
date: "Jun 25 2024"
arxivURL: "https://arxiv.org/abs/2407.19996"
openReviewURL: "https://openreview.net/forum?id=d3Vj360Wi2"
repoURL: "https://github.com/amonroym99/iti-gen-reproducibility"
---

Text-to-image generative models often present issues regarding fairness with respect to certain sensitive attributes, such as gender or skin tone. This study aims to reproduce the results presented in [ITI-GEN: Inclusive Text-to-Image Generation](https://arxiv.org/abs/2309.05569) by Zhang et al. (2023), which introduces a model to improve inclusiveness in these kinds of models. We show that most of the claims made by the authors about ITI-GEN hold: it improves the diversity and quality of generated images, it is scalable to different domains, it has plug-and-play capabilities, and it is efficient from a computational point of view. 

However, ITI-GEN sometimes uses undesired attributes as proxy features and it is unable to disentangle some pairs of (correlated) attributes such as gender and baldness. In addition, when the number of considered attributes increases, the training time grows exponentially and ITI-GEN struggles to generate inclusive images for all elements in the joint distribution. 

To solve these issues, we propose using Hard Prompt Search (HPS) with negative prompting, a method that does not require training and that handles negation better than vanilla HPS. Nonetheless, HPS (with or without negative prompting) cannot be used for continuous attributes that are hard to express in natural language, an area where ITI-GEN excels as it is guided by images during training. Finally, we show how to combine both methods.