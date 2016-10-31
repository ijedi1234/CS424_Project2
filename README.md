
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

Chosen at random, how many out of five stars with at least one exoplanet from the Sun have more than one exoplanet?
How does Chosen Star A's mass compare to Chosen Star B's mass?
When was Chosen Star A's sole exoplanet discovered?
How many times greater is Chosen Star A b's minimum mass than Chosen Star A c?

[Images needed here]

# Why Our Visualization Techniques Are Best:

Our first technique involves a large field of stars. One can visually see that one star is farther from the Sun then another easily with this method. The ability to click on stars to "select" them
for the star and exoplanet visualizations provides a very simple way for users to analyze star systems of interest. Zooming functionality is provided so the user does not click on an unwanted star on accident.
No other approach is better because of the ease of choosing stars based on how far away they are; after all, a user casually using the visualization might prefer to view information
on stars close to home than those very far away.

Our second technique is a scatter plot. This easily shows differences between certain star attributes and provides a button to toggle between attributes. This is better than or as good as other approaches
due to the intuition of knowing how to compare between two values plotted on the scatter plot.

The third technique, known as the Cascaded Pietree, is an implementation of one of the trees described in "A generative layout approach for rooted tree drawings" by Hans-Jörg Schulz, Zabedul Akbar and Frank Maurer.
Since there are so few planets per star, and the depth of the tree is very low (top level being the star, next being the exoplanet names, and the last being the exoplanet attributes), this is best at showing
a concise presentation of exoplanet data. Note, again, that the exoplanet data most likely to have a non-empty value is used for the exoplanet attribute data. 

# Paper citation

Schulz, Hans-Jörg, Zabedul Akbar, and Frank Maurer. "A generative layout approach for rooted tree drawings." 2013 IEEE Pacific Visualization Symposium (PacificVis). IEEE, 2013.

# Team member responsibilities

Andy: Create dashboard framework and star field visualiation. Also assist with readme.
Patrick: Create scatter plot visualization and assist with transition implementation.
Louis: Create Cascaded Pietree visualization. Also assist with readme.