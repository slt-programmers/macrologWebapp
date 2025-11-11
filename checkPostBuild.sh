#!/bin/bash

echo "------------------------------"
echo "Controle of andere build gedaan moet worden!"
echo "------------------------------"

echo "On environment $NODE_ENV"

if [[ $NODE_ENV == "acceptance" ]]; then
  echo ng build --aot --configuration="acceptance"
  ng build --aot --configuration="acceptance"
else
  echo ng build --aot --configuration="production"
  ng build --aot --configuration="production"
fi
