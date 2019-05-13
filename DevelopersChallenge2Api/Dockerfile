FROM mcr.microsoft.com/dotnet/core/sdk:2.2 AS base

FROM base AS builder

    WORKDIR /api

    RUN dotnet build
