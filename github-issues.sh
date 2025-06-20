#!/usr/bin/env bash

create_issue() {
  title="$1"
  body="$2"
  labels="$3"
  echo "Creating: $title"
  gh issue create --title "$title" --body "$body" --label "$labels"
}

create_issue "[BUG] AuthGuard triggers on every page request" \
"The frontend is pinging the backend on every page navigation due to the AuthGuard. This introduces delays and creates poor UX.

**Tasks:**
- Cache or persist auth state
- Trigger loading overlay when verifying auth" \
"bug,auth"

create_issue "[BUG] Missing field titles on Create Fighter form" \
"Gender and alignment fields are missing titles on the Create Fighter form." \
"bug,form"

create_issue "[BUG] Transparency on combat pose images" \
"Combat pose images need a very bland contrast background, as transparent areas sometimes remove character color." \
"bug,image"

create_issue "[ENHANCEMENT] Navbar title should link to dashboard" \
"Clicking the 'Fight Club' text in the nav bar should redirect to \`/dashboard\`." \
"enhancement,routing"

create_issue "[TASK] Add validation to all form inputs" \
"All form inputs should have basic validation (e.g., required fields, correct formats)." \
"task,form"

create_issue "[BUG] Profile picture doesn’t refresh after upload" \
"Profile image updates only on reload. It should update immediately in both the profile page and navbar." \
"bug,image"

create_issue "[FEATURE] Add toast notifications" \
"Add toast UI for user feedback (e.g., success messages, errors, actions)." \
"feature,ui"

create_issue "[ENHANCEMENT] Add example text to form inputs" \
"Add random fun/unhinged placeholder examples to all form fields, similar to 'Species' field." \
"enhancement,form"

create_issue "[FEATURE] Add Support Me button" \
"Explore support platforms (e.g., Patreon, Ko-fi) and add a button to the site." \
"feature,ui"

create_issue "[FEATURE] Add character report system" \
"Implement report button on character profiles.

**Features:**
- Modal with dropdown for reason (Inappropriate, Pornographic, Other)
- Free-text explanation box
- Capture user if logged in, anonymous otherwise" \
"feature,moderation"
