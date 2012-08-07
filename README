=========================================================================
``towel_bootstrap`` -- making it easy to use Towel with Twitter Bootstrap
=========================================================================

.. note::

    You have to add ``towel_bootstrap`` to ``INSTALLED_APPS``, preferably
    before ``django.contrib.admin`` because otherwise the bootstrapified
    login, logout and password templates will not be picked up.


Included goodies
================

Base templates
--------------

* ``towel_bootstrap/base.html``:

  Base template for everything. CSS is at the top, Javascript at the bottom.
  Defines two Javascript arrays you might want to be aware of:

  * ``onReady``: A list of functions which will be run on
    ``$(document).ready()``. Receive the jQuery instance as first and only
    argument.

  * ``onForm``: A list of functions which initialize forms. Might be called
    several times on the same set of elements. Receive two arguments, a
    jQuery object wrapping either ``document`` or some subset of the DOM
    and the jQuery instance.

* ``towel_bootstrap/full.html``:

  Template for full-width pages.

* ``towel_bootstrap/modal.html``:

  Template for AJAX-loaded modals.

* ``towel_bootstrap/plain.html``:

  Template covering a smaller width, most useful for login/logout pages and
  such. Empties the main navigation.

All base templates except for ``towel_bootstrap/base.html`` extend
``base.html``. This means that if you provide your own ``base.html`` which only
overrides the bare minimum of regions, you can use all other templates right
away.

The following blocks are available by default:

* ``title``: Browser title
* ``css``: CSS declaration.
* ``body``: Everything inside ``<body/>`` except for ``templates`` and ``js``.
* ``navigation``: The content of the navbar.
* ``main``: The main container, that is, everything except for the navigation
  and the footer.
* ``search``: A search form embedded in the sidebar.
* ``sidebar``: The sidebar itself.
* ``messages``: A messages container above the page header and the content.
* ``page-header``: The page header, most useful when there is a
  ``<div class="page-header"/>`` inside.
* ``content``: Content.
* ``footer``: The footer.
* ``templates``: May be used for Javascript templates, meaning mainly for
  ``<script type="text/template"/>`` tags.
* ``js``: All Javascript files and code.


ModelView templates
-------------------

``towel_bootstrap`` comes with a selection of templates most useful with
ModelView. Have a look at the files in
``towel_bootstrap/templates/modelview/``.


Towel templates
---------------

``towel_bootstrap`` overrides the styles of form items, form errors and
warnings, of ordering links in the list pages and of the pagination.


Templates for ``django.contrib.auth``
-------------------------------------

Log in, log out, password change and reset templates are included as well.


Template tags
-------------

Contains a template tag most useful for marking the current navigation entry.
Use as follows::

    {% load mark_current %}
    {% mark_current request.path %}
        <li><a href="..."></a></li>
        <li><a href="..."></a></li>
        <li><a href="..."></a></li>
    {% endmark_current %}

Each navigation entry should occupy one line; adds a ``class="active"`` where
the current URL begins with the ``href`` attribute value.


Javascript helpers
------------------

* ``onReady`` and ``onForm`` have already been described above.
* ``$.fn.flash``: Changes a set of elements to be partially translucent before
  fading them in to complete opacity again.
* ``$.fn.autogrow``: When applied to a textarea, causes the textarea to
  automatically expand in height when new content is added so that no scrollbar
  appears. Is applied by default to all elements matching
  ``textarea.autogrow``.
* ``initForms([elem])``: Runs all handlers in ``onForm``. Defaults to handling
  everything inside ``document`` if no object is passed.
* ``modalLoad(url)``: Loads a bootstrap modal from a remote URL. This is
  automatically activated for all elements matching
  ``a[data-toggle=ajaxmodal]``.
* All AJAX requests are patched to work with Django's CSRF protection.


Third-party libraries
---------------------

* `jQuery <http://jquery.com>`_.
* `Harvest chosen <http://harvesthq.github.com/chosen/>`_.
* `Bootstrap datepicker <https://github.com/eternicode/bootstrap-datepicker/>`_.

* Bootstrap itself is NOT included. The templates expect to find all of
  bootstrap at ``{{ STATIC_URL }}bootstrap/``.
