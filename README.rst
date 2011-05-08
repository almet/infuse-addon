FFSugest
########

Suggest is the implementation of a context-aware web recommendation system. It
is decoupled into two parts: a firefox plugin which retrieve the browsing
data and a server side script which expose an API and provide tools to extract
data, analyse them, cluster them and provide recommendations.

FFSuggest is the browsing part of the project.

Record the browsing actions
===========================

The goal of this firefox extension is to record users actions while browsing.
The following informations are recorded:

* A resource is loaded in a tab
* A tab is closed
* A tab is opened from another one (and is thus considered as a child)

For each event, the time, location, tab number (unique) and URL are sent to the
server and recorded for later analyse.

Manage your account
===================

Because you need to be authenticated, the plugin offers a way to enter
a servername, account name and password.

Blacklisting sites
==================

If there are websites you don't want to be recorded, you can specify them in
a list.

Activation / Deactivation
=========================

At any time, you can deactivate the plugin (you have to click on the icon) so
it doesnt record your browsing.

Private browsing
================

While in private browsing, the plugin is considered inactive and thus doesnt
send any kind of information to the API
