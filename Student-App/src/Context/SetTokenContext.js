import React, {Children, useState} from 'react';

const SetTokenContext = React.createContext();

export const SetTokenProvider = SetTokenContext.Provider;
export const SetTokenConsumer = SetTokenContext.Consumer;

export default SetTokenContext;
