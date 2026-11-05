# Dataset and model registry

Nothing in this registry has been downloaded. Officially recommended means listed for Track 4 in the participant readiness guide; it does not mean endorsed for unrestricted use. Licence, access, safety, disk, and safeguarding checks are required first.

| Source | Status | Purpose | Access / licence review | Format | Intended use |
|---|---|---|---|---|---|
| PhishTank - https://phishtank.org/ | Officially recommended | Community phishing intelligence | API terms and redistribution review | JSON/CSV/API | Evaluation and evidence lookup |
| URLhaus - https://urlhaus.abuse.ch/ | Officially recommended | Malicious URL intelligence | Abuse.ch terms; handle indicators safely | CSV/JSON/API | Evaluation and evidence lookup |
| OpenPhish - https://openphish.com/ | Officially recommended | Phishing intelligence | Community/commercial access conditions | Feed | Evaluation and evidence lookup |
| UCI repository | Officially recommended category | Cybersecurity/phishing datasets | Dataset-specific licence | Varies | Training/evaluation |
| Hugging Face phishing models | Officially recommended category | Phishing classification baseline | Model-card and licence review | Model weights | Baseline inference |
| Hugging Face spam models | Officially recommended category | Fraudulent-message baseline | Model-card and licence review | Model weights | Baseline inference |
| UCI PhiUSIIL - https://archive.ics.uci.edu/dataset/967/phiusiil+phishing+url+dataset | Additional candidate | URL classification | CC BY 4.0 shown by UCI; re-check before use | Tabular | Training/evaluation |
| UCI SMS Spam Collection - https://archive.ics.uci.edu/dataset/228/sms+spam+collection | Additional candidate | SMS spam baseline | CC BY 4.0 shown by UCI; re-check provenance | Text labels | Baseline evaluation |
| Horizon-Labs/phishing-scam-detector-base - https://huggingface.co/Horizon-Labs/phishing-scam-detector-base | Additional candidate | Text phishing classifier | Model-card/licence and limitations review | Model weights | Baseline inference |
| Synthetic Uganda child scam evaluation set | Team-created candidate | Local scenarios, uncertainty, child-friendly response checks | Synthetic only; document generation and review | JSONL | Evaluation only initially |

The retrieval manifest in `backend/src/ai-engine/datasets/registry.json` records `downloadStatus: not_downloaded`. Retrieval scripts must require an explicit source selection and must never visit candidate malicious URLs.
