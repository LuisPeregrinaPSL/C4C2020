# Staying@Home

  Gamifying and analyzing People@home data to focus preventive spread measures

   ### Team members
   * Jaime de Alba (jaime_alba@persistent.com)
   * Guillermo Moreno (guillermo_moreno@persistent.com)
   * Roberto Mosqueda (roberto_mosqueda@persistent.com)
   * Luis Peregrina (luis_andrade@persistent.com)
   * Hector Toscano (hector_toscano@persistent.com)
   
  ### Project Description
  
  **Problem solved:**
  The most effective action to prevent the spread of the virus used on all countries is the lockdown and/or stay at home policy. 
  
  However, countries are facing big challenges to make sure people follow this policy. As a result, there are multiple actions implemented by governments to invite/force people to stay at home, these actions and policies are being applied to broad areas such as cities, states, countries:
  
  - Security checkpoints on streets
  - Policy patrols asking people to go Home
  - Multiple advertising and sensitization campaigns
  - Sanitizer tunnels in crowded places
  
  A more localized implementation of these measures could help to get better results and optimize resource utilization.

  **Proposed solution:** our solution includes 2 main components:

**Data analyzer:**
Online platform receiving data and statistics about the time that people stays at home on different areas. 
The platform uses kibana and elastic search to build real time graphs showing which areas better meet the stay at home restrictions.

**Mobile application / Data collector:**
The data collection is done using an app that the users will install on their mobile phones, this application allows the users to track how long they have stayed at home and sends the statistics to the data analyzer.

By using gamification, the app allows the user to build a forest at their virtual home and contribute to their community as follows:

-	For each 6 consecutive hours at home, user will get a tree.
-	For every 3 trees that he gets, one is also added to his community forest.
-	If he leaves home before the 6 hours needed to get a tree, then a new one starts growing from 0 once he gets back home.
-	As more trees are added to the forest, user can get additional items and go through different contribution levels.

There is a GPS tracking component monitoring if the users moves enough to consider that they leave home.

**Benefits**
- Government will be able to optimize resources utilization
- Quick insights about the results of measures implemented for Stay at home initiatives
- Better understanding of areas that may require more help
- Motivate people to stay at home by allowing to track time in lockdown and recognizing them

### Link to video:

### Roadmap:

### IBM Services and Open Sources components/services
- Kibana / Elastic Search
- Ionic framework
