🔒 Fix missing rel=noopener noreferrer on external links

🎯 **What:** Added missing `rel="noopener noreferrer"` to external links opening in a new tab (`target="_blank"`) in `EngagementDock.tsx`.
⚠️ **Risk:** Reverse tabnabbing attack where the external page gains access to the `window.opener` object, potentially redirecting the original page to a malicious site or phishing page.
🛡️ **Solution:** Added `rel="noopener noreferrer"` to the external link tags for X and LinkedIn sharing, which breaks the connection to the original tab's window object.
