# Why should you use a state manager for your application?

The title already hints at it: You really should be using a state manager for your application. Why? Because it's worth the effort.

So, there you have it. That's why. But, to make this into a bit more interesting read, let's discuss it some more. The short answer "it's worth the effort" indicates there are two things to consider: there's some effort, and apparently there's some reward that makes it worthwhile.

## What is state?

Pretty much every application has some *state*. State is a very general term and can encompass pretty much any data in your application. Let's go through some examples, some may be a bit more obvious then others:

- Items in a shopping cart on a web shop
- The logged in user
- The messages, message groups, and contacts in a messaging application
- The current page / view in an application, including its title and toolbar buttons (if these change)

In very general terms: The entirety of all the data in the application, that may change, that's the state.

## What does the state manager do?

Chances are that quite a few bits of data are used in more than one place. Coming back to the online shop example, the total worth of the purchase might be displayed on the page of the shopping cart, as well as on the checkout and payment pages. And probably most of the other pages of the shop are concerned with that data, too: You can add something to the cart and thereby modify this state.

A state manager gives the data that makes up your state a place in your application. It may take care of various aspects, such as where the data is read from, how to manipulate it, and how changes are being communicated and distributed throughout the application.

## Benefits

The key benefit that comes from using a state manager, is a type of predictability.

### Benefit 1: UI as a function of state

If you're fond of *functional programming* or *maths* you might like to think of the application's user interface as a function of the application's state:

> UI = f(state)

Now for anyone who doesn't share this love for maths, what does it *mean*? In layman's terms: "Show me your application's state and I'll tell you what your UI looks like".

Think about it. Imagine your favourite online shop. When you think about putting a few items in your shopping cart, don't you have a very clear expectation of what the checkout screen should look like?

Now one more thing: It's not just about getting data for display. It's also about a way to go about data manipulation. Using the shopping cart analogy: Should it make a difference in the total price of your order, whether you entered the coupon on the page of the shopping cart or at the page where you entered you payment details? I'd expect it to make no difference. A "spring sale: 10% off on sports shoes" coupon should always result in a reduction of 10% on sports shoes. So, entering the coupon changes the state, and the UI reflects that again.

This predictability is very handy, and leads to the next benefit.

### Benefit 2: Testing

State managers make testing a breeze. With testing, like with many other things, there are "diminishing returns". There are some things, if you don't test them, and they turn out to be broken, it's not the end of the world. Other things, if you don't test them, you're just plainly careless.

Now, if you're applying the mindset from above (UI as a function of state), the UI becomes a "dumb" view, merely a projection of the state. That doesn't mean you shouldn't test the UI at all. It just means, it's more important to test the state management itself, because the state may show up in different spots all over the application. If you get the state right, the UI should follow "automatically" as it's a function of the state.

Of course you can still mess the view up. (E.g. instead of showing the total with taxes, showing the total before taxes due to a copy and paste bug. Oops.) Nobody is saying, you shouldn't test your views, but, if you have to limit / focus your testing efforts, you could be worse off than writing automated tests for your application's state handling, and "just" checking your views manually.

## Conclusion

So, there is some effort involved: You need to learn how to use the state manager, and you need to set it up in your project. But the principle of having a place to put all your state information and interaction gives you the benefits of knowing where to find the information, and knowing what to test. This will ultimately lead to more robust code and peace of mind.

A state manager is part of your application architecture, and there isn't just one right way to do it. rdx takes a tried and true take on it, that is inspired by functional programming. You can read more about in [the architecture of rdx](./background-rdx-architecture.md).

Finally, here's the (strongly biased) take home message: You should totally be using a state manager in your application. In fact, don't just use any one, *use rdx*.
