# Phish or Real? — Shark Week Lite

## Overview
A fun, light-hearted phishing & smishing awareness game. Players guess if a message is real or a phishing attempt. Designed to be embedded in SharePoint or hosted via GitHub Pages.

## Files
- `index.html` — main game
- `style.css` — styling
- `script.js` — logic, score tracking, and Power Automate integration
- `assets/` — images & icons (shark, phish, real)
- `sample_payload.json` — example JSON for Power Automate schema

## Hosting Instructions
1. Upload the folder to your GitHub repository.
2. Enable GitHub Pages on the branch/folder you uploaded.
3. Copy the Pages URL and embed it in SharePoint using the **Embed Web Part**.

## Power Automate Integration
1. Create a new **Automated Cloud Flow** with **"When an HTTP request is received"** trigger.
2. Use `sample_payload.json` to generate the request schema:
```json
{
  "playerName": "string",
  "score": "number",
  "timestamp": "string"
}
```
3. Add an action **Create Item** to your SharePoint list `PhishOrReal_Results`.
   - Map `playerName`, `score`, and `timestamp` to the appropriate columns.
4. Copy the HTTP POST URL and paste it into `script.js` at `const FLOW_URL = "YOUR_FLOW_URL_HERE";`.
5. Test by playing the game. Scores should appear in the SharePoint list with timestamp and player name.

## Customization
- Change colors, fonts, or card layout in `style.css`.
- Edit questions in `script.js` under the `QUESTIONS` array.
- Update the header banner in `assets/title-banner.svg`.

## Troubleshooting
- Ensure GitHub Pages URL is HTTPS to avoid mixed content issues in SharePoint.
- Check browser console for any POST errors if scores do not appear in SharePoint.