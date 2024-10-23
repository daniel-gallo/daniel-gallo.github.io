---
title: '📄 NeurIPS - DuoDiff: Accelerating Diffusion Models with a Dual-Backbone Approach'
description: "We accelerate diffusion by using a simpler model for the initial sampling steps."
date: "October 12 2024"
arxivURL: "https://arxiv.org/abs/2410.09633"
openReviewURL: "https://openreview.net/forum?id=G7E4tNmmHD"
---

Diffusion models have achieved unprecedented performance in image generation, yet they suffer from slow inference due to their iterative sampling process. To address this, early-exiting has recently been proposed, where the depth of the denoising network is made adaptive based on the (estimated) difficulty of each sampling step. Here, we discover an interesting "phase transition" in the sampling process of current adaptive diffusion models: the denoising network consistently exits early during the initial sampling steps, until it suddenly switches to utilizing the full network. Based on this, we propose accelerating generation by employing a shallower denoising network in the initial sampling steps and a deeper network in the later steps. We demonstrate empirically that our dual-backbone approach, DuoDiff, outperforms existing early-exit diffusion methods in both inference speed and generation quality. Importantly, DuoDiff is easy to implement and complementary to existing approaches for accelerating diffusion.

