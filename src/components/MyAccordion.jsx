import React, { Component } from "react";
import { Accordion, Icon } from "semantic-ui-react";

export default class MyAccordion extends Component {
  state = { activeIndex: 0 };

  handleClick = (e, titleProps) => {
    const { index } = titleProps;
    const { activeIndex } = this.state;
    const newIndex = activeIndex === index ? 0 : index;

    this.setState({ activeIndex: newIndex });
  };

  render() {
    const { activeIndex } = this.state;

    return (
      <Accordion style={{ border: "1pt solid #505050" }} fluid styled>
        <Accordion.Title
          active={activeIndex === 0}
          index={0}
          onClick={this.handleClick}
        >
          <Icon name="dropdown" />
          {this.props.title[0]}
        </Accordion.Title>
        <Accordion.Content active={activeIndex === 0}>
          {this.props.content[0]}
        </Accordion.Content>

        <Accordion.Title
          active={activeIndex === 1}
          index={1}
          onClick={this.handleClick}
        >
          <Icon name="dropdown" />
          {this.props.title[1]}
        </Accordion.Title>
        <Accordion.Content active={activeIndex === 1}>
          {this.props.content[1]}
        </Accordion.Content>
      </Accordion>
    );
  }
}
