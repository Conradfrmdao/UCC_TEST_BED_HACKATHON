# UCC Testbed integration

The readiness guide says the event provides an on-site Lambda Vector GPU workstation running Ubuntu with key-based SSH over the dedicated event network, plus shared Testbed hosts. Exact hostnames, credentials, GPU specifications, and inference endpoints are not assumed here.

Suggested workflow after organisers provide access:

1. Generate the requested SSH public key locally and share only the public key through the approved channel.
2. Confirm host fingerprint, network policy, user account, storage quota, CUDA/runtime versions, and permitted containers with the Help Desk.
3. Transfer only approved code/model artefacts; never transfer `.env`, real child data, or private keys.
4. Start a small authenticated inference service bound according to organiser policy.
5. Set `UCC_INFERENCE_URL` and `UCC_INFERENCE_TOKEN` locally, then enable the adapter behind a feature flag.
6. Record model version, latency, hardware, test set version, errors, and evaluation metrics as proof of Testbed use.
7. Shut down services and remove temporary sensitive artefacts according to the event policy.

The local Express service remains functional when this adapter is not configured.
