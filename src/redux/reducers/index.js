import { combineReducers } from "redux";

import login from "./login.js";
import profile from "./profile.js";
import notification from "./notification.js";
import registration from "./registration.js";
import myVisitor from "./my_visitor";
import invite from "./invite";
import home from "./home";
import switchUnit from "./switch_unit";
import complaint from "./complaint";
import facility from "./facility_booking";
import community from "./community.js";
import video from "./video_call";
import localhelp from "./localhelp.js";
import feedback from "./feedback.js";
export default combineReducers({
  community,
  login,
  profile,
  notification,
  registration,
  myVisitor,
  invite,
  home,
  switchUnit,
  complaint,
  facility,
  video,
  localhelp,
  feedback,
});
