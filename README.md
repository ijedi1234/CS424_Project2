﻿
# CS424_Project2



This repository holds CS424 Project 2 code.


# Installation Instructions

Extract Project 2's contents to a folder. Navigate to the folder holding Project 2. Use the command "[path to python.exe]\python -m SimpleHTTPServer 8080" to start the server.
If this command cannot start the server, use the command "[path to python.exe]\python -m http.server 8080" instead. Go to localhost:8080/CS424_Project2 on Google Chrome to load the visualziation.

# Motivation for Acquiring our Particular Datasets:

We have two datasets: A large tabular dataset concerning information for each exoplanet, and a network dataset mapping stars to planets. The network dataset was derived from the first by checking for like stars
for various exoplanets. The motive for using the first was to get raw data on celestial bodies; the motive for the second was to provide a mapping for solar system visualization creation.
The star-exoplanet mapping does not exist in the original table, requiring the network dataset to be created.

# Visualization Dashboard Audience:

The intended audience for this project are those who are curious about "close" celestial bodies orbiting stars outside the Solar System. Some understanding about simple physics is expected, such as
understanding the concepts of mass and an orbital period. This expectation is reasonable since only those with some interest in astronomy would have an interest in an exoplanet visualization.

# Insights made possible:

A user will be able to gain a sense of how many discovered exoplanets have been discovered by star with at least one known exoplanet. Note that most have only one exoplanet.
A user will also be able to easily compare three notable qualities of known exoplanets per star: The minimum mass, the orbital period, and the discovery year.
These were chosen because they are very likely to have data for any given exoplanet. Comparisons could show how much greater in minimum mass one body is over another, for example.

Example questions that can be answered by the visualization:

Chosen at random, how many out of five stars with at least three exoplanets from the Sun have more than three exoplanets?

How does Chosen Star A's mass compare to Chosen Star B's mass?

How much farther from the Sun is Chosen Star A than Chosen Star B?

When was Chosen Star A's sole exoplanet discovered?

How many times greater is Chosen Star A b's minimum mass than Chosen Star A c?

# Project Images

![alt text](https://i.sli.mg/TpfUA6.jpg "Scatter Plot")

![alt text](https://i.sli.mg/79ML2p.jpg "Star Field")

![alt text](https://i.sli.mg/qN7xO1.jpg "Pietree and Nomogram")

# Why Our Visualization Techniques Are Best:

Our first technique involves a large field of stars. One can visually see that one star is farther from the Sun then another easily with this method. The ability to click on stars to "select" them
for the star and exoplanet visualizations provides a very simple way for users to analyze star systems of interest. Zooming functionality is provided so the user does not click on an unwanted star on accident.
No other approach is better because of the ease of choosing stars based on how far away they are; after all, a user casually using the visualization might prefer to view information
on stars close to home than those very far away.

Our second technique is a scatter plot. This easily shows differences between certain star attributes and provides a button to toggle between attributes. This is better than or as good as other approaches
due to the intuition of knowing how to compare between two values plotted on the scatter plot.

The third technique, known as the Cascaded Pietree, is an implementation of one of the trees described in "A generative layout approach for rooted tree drawings" by Hans-J�rg Schulz, Zabedul Akbar and Frank Maurer.
Since there are so few planets per star, and the depth of the tree is very low (top level being the star, next being the exoplanet names, and the last being the exoplanet attributes), this is best at showing
a concise presentation of exoplanet data. Note, again, that the exoplanet data most likely to have a non-empty value is used for the exoplanet attribute data.

The fourth technique is a parallel coordinate plot (nomogram) mapping each star's exoplanets in the pie queue in the third visualziation with planet data. Data can be filtered easily by clicking and dragging on
an axis to create a slider than only permits data that passes through it to be drawn to screen. This visualization helps remove the need to use many different colors for telling exoplanets apart,
 and the exoplanets for each star can be easily distinguished using the second axis listing planet names.

# Data Abstraction of the Project

Our table of exoplanets and their attributes is a flat table; the "key" for each row is the row value.
The tabular dataset is sued to derive a network dataset containing a tree of stars conencted to their exoplanets.
These two datasets are merged together to permit the use of a star name as a key to get information on the star and links to its exoplanets; the exoplanets have their own keys to be used with the solar system information.
Therefore, the dataset used to get star information is effectively a flat table due to only needing the star key; the dataset used to get exoplanet information is effectively a multidimensional table 
due to the need of having a star and exoplanet key to get exoplanet information.

# Task Abstraction of the Project

Discover - A user can use the star field visualization to discover information on stars at various distances from the Sun.
Annotate - Annotations (tooltips) appear in the scatter plot when a data item is hovered over.
Record - At most 8 star systems can be recorded for the pietree visualziation at a time. These eight recorded star systems are also used by the other non-star field visualziations.
Derive - The second network dataset is derived by the first tabular dataset. The network dataset is most notably used in the piretree visualziation.
Lookup - A user can use the filter provided in the star field visualization to find star systems with a number of exoplanets greater or equal to the number in the filter.
Compare - Using the parallel coordinate plot, a user can compare the exoplanets to one another. The scatter plot can also permit the user to compare star attribtues to each other.

# Video Overview

https://www.youtube.com/watch?v=352Rxy9I_O0&feature=youtu.be

# Value to Domain Experts

Our project can scope better than current analytics approaches. Consider, for example, the visualization provided by exoplanets.org: http://exoplanets.org/plots .

There is no simple way to find all the exoplanet information for a single star, just a large mass of them, in the exoplanets.org plot. If such a utility does exist for their plot, it is not easily apparent.

Our project, on the other hand, can provide various attributes for other solar systems, including star information and the data on their exoplanets without interference from other stars or exoplanets.

This can be done by simply selecting a star of interest and viewing it and its exoplanets' properties.

As another improvement, our project is also much more colorful and enticing than the exoplanet.org plot; where exoplanet.org is mostly filled with white, our project has a great multitude of colors, especially in the
pietree visualization.

# Paper citation

Schulz, Hans-J�rg, Zabedul Akbar, and Frank Maurer. "A generative layout approach for rooted tree drawings." 2013 IEEE Pacific Visualization Symposium (PacificVis). IEEE, 2013.

# Team member responsibilities

Andy: Create dashboard framework, star field visualization, and planet comparison PCP. Also assist with readme.

Patrick: Create scatter plot visualization and assist with transition implementation. Also helped with linking the various interactions between visualizations.

Louis: Create Cascaded Pietree visualization. Also assist with readme.
