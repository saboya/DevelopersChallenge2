FROM node:12.2.0-alpine AS base

FROM base AS development

    WORKDIR /ui

FROM base AS builder

    COPY . /ui

    RUN yarn

    RUN yarn build
