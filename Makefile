.PHONY: configure test clean

clean:
	rm -rf OSCAL OSCAL.zip || true

REPO ?= metaschema-framework/OSCAL
BRANCH ?= main
OSCAL_SERVER_VERSION ?= v1.0.0-SNAPSHOT-6363f60-20241202160440
OSCAL_CLI_VERSION ?= 2.4.0
OSCAL_EXECUTOR ?= oscal-cli

# Check if server is requested but not healthy
ifeq ($(OSCAL_EXECUTOR),oscal-server)
	SERVER_HEALTHY := $(shell npx oscal server status 2>/dev/null || echo "false")
	ifneq ($(SERVER_HEALTHY),true)
		override OSCAL_EXECUTOR = oscal-cli
		$(info Server not healthy, falling back to CLI)
	endif
endif


configure: clean check-executor
	@echo "Downloading OSCAL from ${REPO} branch: ${BRANCH}"
	curl -L -f "https://github.com/${REPO}/archive/refs/heads/${BRANCH}.zip" -o OSCAL.zip || exit 1
	unzip -q OSCAL.zip || (rm OSCAL.zip && exit 1)
	mv OSCAL-${BRANCH} OSCAL
	rm OSCAL.zip
	npm install
	npx oscal use ${OSCAL_CLI_VERSION}
ifeq ($(OSCAL_EXECUTOR),oscal-server)
	npx oscal server update ${OSCAL_SERVER_VERSION}
endif
	@echo "OSCAL configured with executor: ${OSCAL_EXECUTOR}"

check-executor:
	@if [ "$(OSCAL_EXECUTOR)" != "oscal-cli" ] && [ "$(OSCAL_EXECUTOR)" != "oscal-server" ]; then \
		echo "Error: OSCAL_EXECUTOR must be either 'oscal-cli' or 'oscal-server'"; \
		exit 1; \
	fi

test:
	OSCAL_EXECUTOR=${OSCAL_EXECUTOR} npm test
