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
        {this.props.content.map((content, index) => {
          return (
            <div key={index}>
              <Accordion.Title
                active={activeIndex === index}
                index={index}
                onClick={this.handleClick}
              >
                <Icon name="dropdown" />
                {this.props.title[index]}
              </Accordion.Title>
              <Accordion.Content active={activeIndex === index}>
                {content}
              </Accordion.Content>
            </div>
          );
        })}
      </Accordion>
    );
  }
}
