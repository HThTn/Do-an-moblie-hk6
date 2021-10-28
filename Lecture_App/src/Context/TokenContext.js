import React, {Children, useState} from 'react';

const TokenContext = React.createContext();

export const TokenProvider = TokenContext.Provider;
export const TokenConsumer = TokenContext.Consumer;

export default TokenContext;
