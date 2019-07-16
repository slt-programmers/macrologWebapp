#!/bin/bash

echo "------------------------------"
echo "Controle of andere build gedaan moet worden!"
echo "------------------------------"

echo "On environment $NODE_ENV"

if [[ $NODE_ENV == "acceptance" ]]; then
  echo ng build --aot --prod --configuration="acceptance"
  ng build --aot --prod --configuration="acceptance"
fi
