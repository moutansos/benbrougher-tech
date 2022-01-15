import React, { createRef } from 'react';

class LibraryCode extends React.Component {
  constructor(props) {
    super(props);
    this.articlesBoardRef = createRef();
  }

  componentDidMount() {
    window.TrelloBoards.create(
      'https://trello.com/b/qo1G8apM',
      this.articlesBoardRef.current
    );
  }

  render() {
    return <div ref={this.articlesBoardRef}>
        <a href='https://trello.com/b/qo1G8apM'>Link to Library</a>
    </div>;
  }
}

export default LibraryCode;
