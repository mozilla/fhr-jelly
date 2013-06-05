#!/usr/bin/env python

# This Source Code Form is subject to the terms of the Mozilla Public
# License, v. 2.0. If a copy of the MPL was not distributed with this
# file, You can obtain one at http://mozilla.org/MPL/2.0/.

import pytest

from selenium.webdriver.common.by import By
from unittestzero import Assert

from pages.home import HomePage
from base_test import BaseTest


class TestFHR(BaseTest):

    @pytest.mark.nondestructive
    def test_that_page_has_correct_title(self, mozwebqa):
        home_page = HomePage(mozwebqa)
        home_page.go_to_page()
        Assert.equal('Firefox Health Report', home_page.page_title)

    @pytest.mark.nondestructive
    def test_graph_date_locale(self, mozwebqa):
        home_page = HomePage(mozwebqa)
        home_page.go_to_page()

        first_date_xaxis = home_page.wait_for_element_present(By.CSS_SELECTOR, '.xAxis .ticklabel:first-child')

        Assert.equal('May', first_date_xaxis.text)
