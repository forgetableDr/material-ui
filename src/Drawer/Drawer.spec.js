// @flow

import React from 'react';
import { assert } from 'chai';
import { createShallow, getClasses } from '../test-utils';
import Slide from '../transitions/Slide';
import createMuiTheme from '../styles/createMuiTheme';
import Modal from '../Modal';
import Paper from '../Paper';
import Drawer from './Drawer';

describe('<Drawer />', () => {
  let shallow;
  let classes;

  before(() => {
    shallow = createShallow({ dive: true });
    classes = getClasses(
      <Drawer>
        <div />
      </Drawer>,
    );
  });

  describe('prop: type=temporary', () => {
    it('should render a Modal', () => {
      const wrapper = shallow(
        <Drawer>
          <div />
        </Drawer>,
      );
      assert.strictEqual(wrapper.name(), 'withStyles(Modal)');
    });

    it('should render Slide > Paper inside the Modal', () => {
      const wrapper = shallow(
        <Drawer>
          <div />
        </Drawer>,
      );

      const slide = wrapper.childAt(0);
      assert.strictEqual(
        slide.length === 1 && slide.is(Slide),
        true,
        'immediate wrapper child should be Slide',
      );

      const paper = slide.childAt(0);
      assert.strictEqual(paper.length === 1 && paper.name(), 'withStyles(Paper)');

      assert.strictEqual(paper.hasClass(classes.paper), true, 'should have the paper class');
    });

    describe('transitionDuration property', () => {
      const transitionDuration = {
        enter: 854,
        exit: 2967,
      };

      it('should be passed to Slide', () => {
        const wrapper = shallow(
          <Drawer transitionDuration={transitionDuration}>
            <div />
          </Drawer>,
        );
        assert.strictEqual(wrapper.find(Slide).props().timeout, transitionDuration);
      });

      it("should be passed to to Modal's BackdropTransitionDuration when open=true", () => {
        const wrapper = shallow(
          <Drawer open transitionDuration={transitionDuration}>
            <div />
          </Drawer>,
        );
        assert.strictEqual(
          wrapper.find(Modal).props().BackdropTransitionDuration,
          transitionDuration,
        );
      });
    });

    it("should override Modal's BackdropTransitionDuration from property when specified", () => {
      const testDuration = 335;
      const wrapper = shallow(
        <Drawer BackdropTransitionDuration={testDuration}>
          <div />
        </Drawer>,
      );
      assert.strictEqual(wrapper.find(Modal).props().BackdropTransitionDuration, testDuration);
    });

    it('should set the custom className for Modal when type is temporary', () => {
      const wrapper = shallow(
        <Drawer className="woofDrawer" type="temporary">
          <h1>Hello</h1>
        </Drawer>,
      );

      const modal = wrapper.find(Modal);

      assert.strictEqual(modal.hasClass('woofDrawer'), true, 'should have the woofDrawer class');
    });

    it('should set the Paper className', () => {
      const wrapper = shallow(
        <Drawer classes={{ paper: 'woofDrawer' }}>
          <h1>Hello</h1>
        </Drawer>,
      );
      const paper = wrapper.find(Paper);
      assert.strictEqual(paper.hasClass(classes.paper), true, 'should have the paper class');
      assert.strictEqual(paper.hasClass('woofDrawer'), true, 'should have the woofDrawer class');
    });

    it('should be closed by default', () => {
      const wrapper = shallow(
        <Drawer>
          <h1>Hello</h1>
        </Drawer>,
      );

      const modal = wrapper;
      const slide = modal.find(Slide);

      assert.strictEqual(modal.prop('show'), false, 'should not show the modal');
      assert.strictEqual(slide.prop('in'), false, 'should not transition in');
    });

    describe('opening and closing', () => {
      let wrapper;

      before(() => {
        wrapper = shallow(
          <Drawer>
            <h1>Hello</h1>
          </Drawer>,
        );
      });

      it('should start closed', () => {
        assert.strictEqual(wrapper.props().show, false, 'should not show the modal');
        assert.strictEqual(wrapper.find(Slide).prop('in'), false, 'should not transition in');
      });

      it('should open', () => {
        wrapper.setProps({ open: true });
        assert.strictEqual(wrapper.props().show, true, 'should show the modal');
        assert.strictEqual(wrapper.find(Slide).prop('in'), true, 'should transition in');
      });

      it('should close', () => {
        wrapper.setProps({ open: false });
        assert.strictEqual(wrapper.props().show, false, 'should not show the modal');
        assert.strictEqual(wrapper.find(Slide).prop('in'), false, 'should not transition in');
      });
    });
  });

  describe('prop: type=persistent', () => {
    let wrapper;

    before(() => {
      wrapper = shallow(
        <Drawer type="persistent">
          <h1>Hello</h1>
        </Drawer>,
      );
    });

    it('should render a div instead of a Modal when persistent', () => {
      assert.strictEqual(wrapper.name(), 'div');
      assert.strictEqual(wrapper.hasClass(classes.docked), true, 'should have the docked class');
    });

    it('should render Slide > Paper inside the div', () => {
      const slide = wrapper.childAt(0);
      assert.strictEqual(slide.length, 1);
      assert.strictEqual(slide.name(), 'withTheme(Slide)');

      const paper = slide.childAt(0);
      assert.strictEqual(paper.length === 1 && paper.name(), 'withStyles(Paper)');
    });
  });

  describe('prop: type=permanent', () => {
    let wrapper;

    before(() => {
      wrapper = shallow(
        <Drawer type="permanent">
          <h1>Hello</h1>
        </Drawer>,
      );
    });

    it('should render a div instead of a Modal when permanent', () => {
      assert.strictEqual(wrapper.name(), 'div');
      assert.strictEqual(wrapper.hasClass(classes.docked), true, 'should have the docked class');
    });

    it('should render div > Paper inside the div', () => {
      const slide = wrapper;
      assert.strictEqual(slide.length, 1);
      assert.strictEqual(slide.name(), 'div');

      const paper = slide.childAt(0);
      assert.strictEqual(paper.length === 1 && paper.name(), 'withStyles(Paper)');
    });
  });

  describe('slide direction', () => {
    let wrapper;

    before(() => {
      wrapper = shallow(
        <Drawer>
          <div />
        </Drawer>,
      );
    });

    it('should return the opposing slide direction', () => {
      wrapper.setProps({ anchor: 'left' });
      assert.strictEqual(wrapper.find(Slide).props().direction, 'right');

      wrapper.setProps({ anchor: 'right' });
      assert.strictEqual(wrapper.find(Slide).props().direction, 'left');

      wrapper.setProps({ anchor: 'top' });
      assert.strictEqual(wrapper.find(Slide).props().direction, 'down');

      wrapper.setProps({ anchor: 'bottom' });
      assert.strictEqual(wrapper.find(Slide).props().direction, 'up');
    });
  });

  describe('Right To Left', () => {
    let wrapper;

    before(() => {
      const theme = createMuiTheme({
        direction: 'rtl',
      });
      wrapper = shallow(
        <Drawer theme={theme}>
          <div />
        </Drawer>,
      );
    });

    it('should switch left and right anchor when theme is right-to-left', () => {
      wrapper.setProps({ anchor: 'left' });
      // slide direction for left is right, if left is switched to right, we should get left
      assert.strictEqual(wrapper.find(Slide).props().direction, 'left');

      wrapper.setProps({ anchor: 'right' });
      // slide direction for right is left, if right is switched to left, we should get right
      assert.strictEqual(wrapper.find(Slide).props().direction, 'right');
    });
  });
});
