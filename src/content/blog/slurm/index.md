---
title: "SLURM tips and tricks"
description: "The very basics of launching jobs"
date: "08/29/2024"
draft: false
---

Your basic jobfile should look like this.

```bash
#!/bin/bash

#SBATCH --partition=gpu_a100
#SBATCH --gpus=1
#SBATCH --cpus-per-task=18
#SBATCH --job-name=train
#SBATCH --ntasks=1
#SBATCH --time=10:00:00

source venv/bin/activate
python train.py
```

# Log everything
When you are launching experiments, it is very important to keep track of what you launched (launch script) and the output (both the standard output and standard error). I like to store everything in folders with the job ID as name (that is accessed with `%A` in the SLURM directives, and *SLURM_JOB_ID* in the bash script). Then, I keep track of all the job IDs in a spreadsheet.

```bash
#SBATCH --output=logs/%A/stdout.txt
#SBATCH --error=logs/%A/stderr.txt

cp $0 logs/${SLURM_JOB_ID}/script.sh
```

# Parallelize everything
If your task is parallelizable, do so. Launching many small jobs is better than launching a big one, because they can run in parallel, and because the scheduler will favour shorter jobs. 

## Array jobs
In some cases, it is interesting to launch a bunch similar jobs. For example, you might want to generate lots of images to compute the FID score of a diffusion model.
```bash
#SBATCH --output=logs/%A_%a/stdout.txt
#SBATCH --error=logs/%A_%a/stderr.txt
#SBATCH --array=1-10

cp $0 logs/${SLURM_ARRAY_JOB_ID}_${SLURM_ARRAY_TASK_ID}/script.sh

source venv/bin/activate
python inference.py \
    --seed ${SLURM_ARRAY_TASK_ID} \
    --output ./samples-${SLURM_ARRAY_TASK_ID}
```
Notice that in the SBATCH directives, `%A` and `$a` correspond to *SLURM_ARRAY_JOB_ID* and *SLURM_ARRAY_TASK_ID* in the bash script. Notice also that we are using *SLURM_ARRAY_JOB_ID* (that is the same for all launched jobs), not ~SLURM_JOB_ID~.

## Dependencies
Some jobs need to wait until another is done to start. In those cases, you can do something like this:
```bash
#SBATCH --dependency=afterok:123456
```

# Get notified
It can be useful to get an email if your job fails (you might get an OOM exception for example). Instead of `ALL`, you can use `BEGIN`, `END`, `FAIL`,`TIME_LIMIT`, `TIME_LIMIT_80` (reached 80 percent of the time limit)...
```bash
#SBATCH --mail-type=ALL
#SBATCH --mail-user=user1@mail.com,user2@mail.com
```

# Resource monitoring
You can check how many credits you have left with `accinfo`, how many credits have been used by other users in your account with `accuse` and the status of the nodes with `sinfo --summarize`.