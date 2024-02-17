.PHONY: deploy
deploy:
	sam build --no-cached
	sam deploy --profile=$(profile) \
		--stack-name nextjs-openai-stream \
		--resolve-s3 \
		--s3-prefix nextjs-openai-stream \
		--resolve-image-repos \
		--capabilities CAPABILITY_IAM \
		--parameter-overrides "ParameterKey=OpenaiApiKey,ParameterValue=$(openai_api_key)"
