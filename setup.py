#!/usr/bin/env python

import os

from setuptools import find_packages, setup


def read(filename):
    return open(os.path.join(os.path.dirname(__file__), filename)).read()


setup(
    name="towel-foundation",
    version=__import__("towel_foundation").__version__,
    description="Keeping you DRY since 2013",
    long_description=read("README.rst"),
    author="Matthias Kestenholz",
    author_email="mk@feinheit.ch",
    url="http://github.com/matthiask/towel-foundation/",
    license="BSD License",
    platforms=["OS Independent"],
    packages=find_packages(),
    package_data={
        "": ["*.html", "*.txt"],
        "towel_foundation": [
            "locale/*/*/*.*",
            "static/chosen/*",
            "static/towel_foundation/*.*",
            "static/towel_foundation/*/*.*",
            "templates/*.*",
            "templates/*/*.*",
            "templates/*/*/*.*",
            "templates/*/*/*/*.*",
        ],
    },
    install_requires=[
        "Django>=3.2",
        "towel>=0.30.0",
    ],
    classifiers=[
        "Development Status :: 5 - Production/Stable",
        "Environment :: Web Environment",
        "Framework :: Django",
        "Intended Audience :: Developers",
        "License :: OSI Approved :: BSD License",
        "Operating System :: OS Independent",
        "Programming Language :: Python",
        "Programming Language :: Python :: 3",
        "Topic :: Internet :: WWW/HTTP :: Dynamic Content",
        "Topic :: Software Development",
        "Topic :: Software Development :: Libraries :: Application Frameworks",
    ],
    zip_safe=False,
)
