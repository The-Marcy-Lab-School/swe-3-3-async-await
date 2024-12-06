# Async/Await

- [Setup](#setup)
- [Testing Your Code](#testing-your-code)
  - [Submitting On Time](#submitting-on-time)
  - [playground.js](#playgroundjs)
  - [npm test](#npm-test)
- [Question 1: Pass in the arguments](#question-1-pass-in-the-arguments)
- [Question 2: Make the function async](#question-2-make-the-function-async)
- [Question 3: Return a tuple](#question-3-return-a-tuple)
- [Question 4: Make the fetch call](#question-4-make-the-fetch-call)
- [Question 5: Check for errors](#question-5-check-for-errors)
- [Question 6: Not ok response](#question-6-not-ok-response)
- [Question 7: is it JSON or not?](#question-7-is-it-json-or-not)
- [Question 8: Return the tuple](#question-8-return-the-tuple)
- [You're done!](#youre-done)

This is perhaps the most utilitarian assignment you've had yet. In this assignment, you will use `async`/`await` to create a nice, versatile fetch handler that you can use throughout the rest of the course. You'll only be editing the `fetchHandler` function in `from-scratch.js`, however we have included a blank `main.js` file if you want to experiment with your fetch handler as you go!

## Setup

For guidance on setting up and submitting this assignment, refer to the Marcy lab School Docs How-To guide for [Working with Short Response and Coding Assignments](https://marcylabschool.gitbook.io/marcy-lab-school-docs/fullstack-curriculum/how-tos/working-with-assignments#how-to-work-on-assignments).

After cloning your repository, make sure to run the following commands:

```sh
npm i
git checkout -b draft
npm t
```

## Testing Your Code

### Submitting On Time

You have to understand that "grades" don't exist at Marcy. We only need performance data in order to know how you're doing, and make sure the people who need help get it as quickly as they can. It's ok if you didn't finish by the deadline! Just show us what you have. We'll have office hours and reviews, and we want to know what you are all struggling with so we can use those meetings effectively. **This is not about grades, its about seeing what you know, and where we can help!**

### playground.js

The most straightforward way to test your code is to test your code by hand as you work. Invoke your functions and use `console.log()` to print out the results. Then, `cd` into the `src/` directory and use the `node <file_name>` command to run your JavaScript files. 

You can also create what's called a "playground" (or "sandbox") file where you import any code you need, and then mess around with that file. We've included one in the `src` directory so you can see it. Run that program using `node src/playground.js`.

### npm test

Before submitting your code, make sure you got things right by running the provided automated tests.

You can do this using the commands:

```sh
npm test # run the automated tests
npm run test:w # run the automated tests and rerun them each time you save a change
```

You will know that you have "completed" an assignment once you have passed 75% or more of the automated tests!

## Question 1: Pass in the arguments
Our function is going to be essentially a wrapper for the `fetch` api, so that means we should be able to pass in the same arguments as we would to `fetch`. That means a `url` string (first param), and an `options` object (second param). Just for fun, set the `options` object to have a default value of `{}`.

## Question 2: Make the function async
Of course we can't move on without this crucial step! Make sure that your function is properly set to `async`.

## Question 3: Return a tuple
A `tuple` (pronounced "TWO-pl" or "TUH-pl") is an "immutable" list with a fixed number of elements. JavaScript doesn't have a "Tuple" type but we can use an array with a fixed number of elements that you will not alter to represent one.

We bring this up because our function is going to return a tuple (an array) with two elements. 
* The first element will be the data
* The second element will be the error. 

But it's an either/or situation:
* If there is data, there is no error.
* If there is an error, there is no data. 

```js
// a tuple with data in the first position and a null error
const resultWithData = [{ message: "hello" }, null];

// a tuple with no data and an error in the second position
const resultWithError = [null, { message: "error!" }];
```

So we can't have both. That's why we use a tuple: we can return the data/error in a consistent manner. We know the data will *always* be in the first element, and the error will *always* be in the second element. If there is no data, we know that there *must* be an error.

```js
const [data, error] = await fetchData('https://some-api.com');
if (error) {
  console.error(error);
}
else {
  doSomethingWith(data);
}
```

**For now, set your function to return [{}, null]. We'll change that later.**

> Why the tuple? <br/>
> It's a valid question! The first reason is because we want to return the data or the error in a predictable way. This will allow us to easily handle errors beyond the function itself. Like if we have an error, pass it along to a rendering function or logger. And of course we want our data!
>
> So, since we technically want 2 things from a function, our options are: return an object or return an array. An object seems like an obvious choice, but there a catch: it would be annoying to grab our data. See, this fetch handler is generic, so it could fetch users, 10 posts, todos, a dog, anything! So if we used an object we'd have to use *object* destructuring to grab our data.
>
> ```js
> const { data: user, error: userError } = await fetchHandler(userUrl);
> ```
> In order to name out variables, we have to *rename* our destructuring. Which is ok, but tedious. Now compare that to array destructuring:
>
> ```js
> const [user, userError] = await fetchHandler(userUrl);
> ```
> Much nicer! Since it's a tuple we know the order will never change!

## Question 4: Make the fetch call
This is straightforward, make a fetch with the url and options passed in. Just save the response to a variable for now (we'll need it for later!).

## Question 5: Check for errors
Before we move on, let's wrap out fetch call in a try/catch. If there is an error we will:
- `console.warn` the error
- return the tuple with the error in the second element and `null` as the first

## Question 6: Not ok response
If your response was not `ok`, we want to `throw` a `new Error` with the message:

`Fetch failed with status - [STATUS], [STATUS_TEXT]`

We don't need to do anything else, as that error will trigger the catch block in the try/catch we just wrote!

## Question 7: is it JSON or not?
Now, a common annoyance is when you get a text or empty body and you were expecting JSON. There's a cool way to tell: the headers on the response! Remember, `headers` is another place that we can store data in and about our request. If the response has a `Content-Type` header that includes `application/json` then we know we have JSON. If not, we can assume it's text.

Pretty sure you've never used this, so we'll help you with the check:

```js
// get the headers from the response.headers
const isJson = (response.headers.get('content-type') || '').includes('application/json');
```

Study that code! `headers.get` will return `null` if it finds nothing, which will break `includes`, so we're using **short circuiting** to make sure we're either getting a text string or an empty string.

With that out of the way, it's up to you to figure out whether to use `response.json()` or `response.text()`.

> Another benefit<br />
> Some status codes have no body to parse, like a 204 or 404. If there's no body, the headers won't have a `Content-Type` set to json. So that means we can use `response.text()` which will simply return an empty string if there's nothing to parse. *Unlike* `response.json()` which will throw an error.

## Question 8: Return the tuple
And finally, with our response parsed either as text or JSON safely, we can return the tuple with the data in the first element and `null` in the second. We *could* simply return [data] with no second value, but that's not a tuple! And we want to be consistent. `null` tells anyone "This was intentional, there is no error, we didn't simply miss it".

## You're done!
OK! No big deal here, this wasn't really about "testing" you, just about giving you a cool tool to use whenever you want to fetch something. We hope you liked it, and learned something along the way!

If you'd like, try testing out your code. You should be able to user your helper like this now:

```js
const getRandomDog = async () => {    
  const [dogData, error] = await fetchData('https://dog.ceo/api/breeds/image/random');

  if (dogData) console.log(dogData);
};

getRandomDog();
```