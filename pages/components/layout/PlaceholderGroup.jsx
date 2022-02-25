import React from 'react';
import {
  Placeholder,
  Divider,
  List,
  Button,
  Card,
  Container,
  Icon
} from 'semantic-ui-react';
import { range } from 'lodash';

export const PlaceholderPosts = () => {

}

export const PlaceholderSuggestions = () => {

}

export const PlaceholderNotifications = () => {

}

export const EndMessage = () => {

}

export const LikesPlaceholder = () => {
  return range(1, 6).map(each => (
    <Placeholder key={each} style={{nimWidth: '200px'}}>
      <Placeholder.Header image>
        <Placeholder.Line length="full" />
      </Placeholder.Header>
    </Placeholder>
  ))
}