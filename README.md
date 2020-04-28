# Staying@Home for a Cause

VR Mobile platform to track and analyze Stay@home behavior

<a href="https://staying-at-home-server.mybluemix.net/">Staying@Home Project Website</a>

   ### Team members
   * Jaime de Alba (jaime_alba@persistent.com)
   * Guillermo Moreno (guillermo_moreno@persistent.com)
   * Roberto Mosqueda (roberto_mosqueda@persistent.com)
   * Luis Peregrina (luis_andrade@persistent.co.in)
   * Hector Toscano (hector_toscano@persistent.com)
   
  ### Project Description
  
  **Problem solved:**
The most effective action to prevent the spread of the viruses is the lockdown or stay at home policy. 

However, countries are facing challenges to motivate and control people to follow this policies. As a result, there are multiple actions implemented by governments to motivate and force people to stay at home, these actions and policies are being applied to broad areas such as cities, states, countries:
  - Security checkpoints on streets
  - Policy patrols asking people to go Home
  - Multiple advertising and sensitization campaigns
  - Sanitizer tunnels in crowded places
 
 A more localized implementation of these measures could help to get faster results and optimize resource utilization.

**Proposed solution:** 

VR Mobile platform to track and analyze Stay@home behavior. The solution includes 2 main components:

**VR Mobile application:**

The VR application can be installed on any mobile device.
The application allows the users to track how long they have stayed at home and sends statistics about his behavior to the Kibana Server.
By using gamification, the app allows the user to build a forest at their virtual home and contribute to their community with the following genera rules:
-	For each 6 consecutive hours at home, user gets a tree.
-	For every 10, 20, 40, 80, and so on, the user is moved to the next Forest level.
-	If User leaves home before the 6 hours needed to get a tree, then a new one starts growing from 0, and one is deleted from his forest.
-  Once he gets back home, a new Tree starts growing from 0.
-	As more trees are added to the forest, user can get additional items and go through different contribution levels.
- User can share his achievements on social networks
- Using VR view, user gets a virtual experience on his home forest

There is a GPS tracking component monitoring if the users leaves home to launch the corresponding events.

**Analytics Dashboard:**
Online platform receiving data and statistics about the time that people stays out of home on different areas. 
The platform uses kibana and elastic search to build real time graphs showing which areas better meet the stay at home restrictions.

**Benefits**
-	Motivate people to stay at home
-	Help people to get some fun and track their time while staying home
-	Quick insights about the results of measures implemented for Stay at home initiatives 
-	Help government to optimize resources utilization 


### Link to video:

### Roadmap: <a href="/docs/Staying@Home Roadmap.pdf">link</a>

### IBM Services and Open Sources components/services

**Online Application Demo and website**
- Node.js & Cloudant application running in IBM Cloud.

**Dashboards:**
- Kibana, ElasticSearch, Python. Running on a Kubernetes cluster in IBM Cloud. 

**Kibana / Elastic Search**
- Node.js & Cloudant application running on IBM Cloud.

**Ionic framework and A-Frame**
- Ionic 4 framework was used for application development; this framework uses Angular 7 with TypeScript for the code, CSS preprocessing using SASS. Ionic leverages the application building duties to Apache Cordova, which in turn uses Node.js as its backbone.
- A-Frame VR framework for Virtual Reality view.
- Ionic Capacitor for Geolocation

