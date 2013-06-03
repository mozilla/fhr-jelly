#!/usr/bin/env python
# This Source Code Form is subject to the terms of the Mozilla Public
# License, v. 2.0. If a copy of the MPL was not distributed with this file,
# You can obtain one at http://mozilla.org/MPL/2.0/.


from base import Base


class HomePage(Base):
    """This Page Object models the Firefox Health Report Page (https://about:healthreport)."""

    # The title of this page, which is used by is_the_current_page() in page.py
    _page_title = u'Firefox Health Report'

    def go_to_page(self):
        """Open the home page."""
        self.open('/')
