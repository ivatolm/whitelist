# whitelist
Service for real-time whitelisting of traffic based on ip

# Build and run
To build a docker container run the following in the project root:
```
docker build -t whitelist .
```
To start built image run the following:
```
docker run --privileged --network host -d whitelist
```
> It could be useful to create a volume for this container.
> To do that run:
> ```
> docker volume create whitelist
> ```
> Then the run command would be:
> ```
> docker run --privileged --network host --volume whitelist:/usr/src/app/data -d whitelist
> ```

# Supported APIs
- `get_list` <br>
Fetches whitelisted IP ranges from the service in form of JSON.
- `allow_ip` <br>
Adds single IP to whilelist configuration.
- `allow_domain` <br>
Adds all IPs assigned to domain to whilelist configuration.
- `get_ips` <br>
Fetches all IPs from configuration that were added by hand (not by domain whitelisting)
- `get_domains` <br>
Fetches all domain names from configuration
